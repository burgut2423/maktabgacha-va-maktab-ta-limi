import { getAccessToken } from './googleAuth';

export interface DriveUploadedFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
}

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const FOLDER_NAME = "Qo'shko'pir_MMTB_Fayllar";

/**
 * Finds or creates the default folder for Qo'shko'pir MMTB files in user's Google Drive
 */
export const getOrCreatePortalFolder = async (): Promise<string> => {
  const token = await getAccessToken();
  if (!token) throw new Error("Google hisobiga ulanmagan");

  // Search for folder
  const query = encodeURIComponent(`name = '${FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const searchRes = await fetch(`${DRIVE_API_URL}/files?q=${query}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!searchRes.ok) {
    const errText = await searchRes.text();
    throw new Error(`Google Drive qidiruvida xatolik: ${errText}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder
  const createRes = await fetch(`${DRIVE_API_URL}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: "Qo'shko'pir tumani maktabgacha va maktab ta'limi bo'limi portali rasmiy fayllari"
    })
  });

  if (!createRes.ok) {
    throw new Error("Google Drive'da jild yaratib bo'lmadi");
  }

  const newFolder = await createRes.json();
  return newFolder.id;
};

/**
 * Uploads a file (image, document, PDF) to Google Drive in the portal folder
 */
export const uploadFileToDrive = async (file: File): Promise<DriveUploadedFile> => {
  const token = await getAccessToken();
  if (!token) throw new Error("Google hisobiga ulanmagan");

  const folderId = await getOrCreatePortalFolder();

  const metadata = {
    name: file.name,
    parents: [folderId],
    description: `Yuklangan sana: ${new Date().toLocaleDateString('uz-UZ')}`
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const reader = new FileReader();

  const fileData = await new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });

  const metadataContentType = 'application/json; charset=UTF-8';
  const fileContentType = file.type || 'application/octet-stream';

  const multipartRequestBody = new Blob([
    delimiter,
    `Content-Type: ${metadataContentType}\r\n\r\n`,
    JSON.stringify(metadata),
    delimiter,
    `Content-Type: ${fileContentType}\r\n`,
    'Content-Transfer-Encoding: base64\r\n\r\n',
    arrayBufferToBase64(fileData),
    closeDelimiter
  ]);

  const uploadRes = await fetch(`${DRIVE_UPLOAD_URL}?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,webContentLink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartRequestBody
  });

  if (!uploadRes.ok) {
    const errorMsg = await uploadRes.text();
    throw new Error(`Google Drive'ga yuklashda xatolik: ${errorMsg}`);
  }

  const uploadedFile = await uploadRes.json();

  // Try to set public read permission so website visitors can view/download
  try {
    await fetch(`${DRIVE_API_URL}/files/${uploadedFile.id}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone'
      })
    });
  } catch (err) {
    console.warn("Ruxsat berishda ogohlantirish:", err);
  }

  return {
    id: uploadedFile.id,
    name: uploadedFile.name,
    mimeType: uploadedFile.mimeType,
    size: formatFileSize(uploadedFile.size ? parseInt(uploadedFile.size, 10) : file.size),
    webViewLink: uploadedFile.webViewLink,
    webContentLink: uploadedFile.webContentLink
  };
};

/**
 * Delete a file from Google Drive (MUST be confirmed by user beforehand)
 */
export const deleteFileFromDrive = async (fileId: string): Promise<boolean> => {
  const token = await getAccessToken();
  if (!token) throw new Error("Google hisobiga ulanmagan");

  const res = await fetch(`${DRIVE_API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok && res.status !== 404) {
    throw new Error("Faylni Google Drive'dan o'chirib bo'lmadi");
  }

  return true;
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function formatFileSize(bytes: number): string {
  if (!bytes || isNaN(bytes)) return '1.2 MB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
