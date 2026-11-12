import React, { useState } from 'react';
import { Send, Search, CheckCircle2, Clock, AlertCircle, FileText, Phone, User, MapPin } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { CitizenAppeal } from '../../types';

export const VirtualReception: React.FC = () => {
  const { appeals, submitCitizenAppeal, organizations } = usePortal();

  const [activeTab, setActiveTab] = useState<'submit' | 'check'>('submit');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    organizationType: 'Qo\'şko\'pir tumani MMTB',
    subject: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // Status check state
  const [searchCode, setSearchCode] = useState('');
  const [searchedAppeal, setSearchedAppeal] = useState<CitizenAppeal | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.message) {
      alert("Iltimos, barça majburiy maydonlarni töldiring.");
      return;
    }

    setSubmitting(true);
    try {
      const code = await submitCitizenAppeal(formData);
      setGeneratedCode(code);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        organizationType: 'Qo\'şko\'pir tumani MMTB',
        subject: '',
        message: ''
      });
    } catch (err: any) {
      alert("Murojaatni yuborişda xatolik: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearchAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    const codeClean = searchCode.trim().toUpperCase();
    const found = appeals.find(a => a.trackingCode.toUpperCase() === codeClean);
    setSearchedAppeal(found || null);
    setHasSearched(true);
  };

  const getStatusBadge = (status: CitizenAppeal['status']) => {
    switch (status) {
      case 'ijro_etildi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ijro etildi (Javob berilgan)</span>
          </span>
        );
      case 'jarayonda':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            <span>Körib çiqiş jarayonida</span>
          </span>
        );
      case 'rad_etildi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Rad etilgan / Tuşuntiriş berilgan</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
            <FileText className="w-3.5 h-3.5" />
            <span>Yangi kelib tuşgan</span>
          </span>
        );
    }
  };

  return (
    <section id="murojaat" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-wider font-semibold text-sky-800">
            Fuqarolar bilan muloqot
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Bölim boşliği virtual qabulxonasi
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-xl mx-auto">
            Qöşköpir tuman ta'lim bölimi rahbariyatiga töğridan-töğri elektron murojaat yöllang
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 mb-8 max-w-md mx-auto">
          <button
            onClick={() => { setActiveTab('submit'); setGeneratedCode(null); }}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'submit'
                ? 'border-sky-700 text-sky-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Yangi murojaat yuboriş
          </button>
          <button
            onClick={() => setActiveTab('check')}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'check'
                ? 'border-sky-700 text-sky-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Murojaat holatini tekşiriş
          </button>
        </div>

        {/* TAB 1: Submit Appeal */}
        {activeTab === 'submit' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            {generatedCode ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Murojaatingiz muvaffaqiyatli qabul qilindi!
                </h3>
                <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
                  Murojaatingiz Qöşköpir tumani MMTB röyxatiga olindi va Google Sheets ma'lumotlar bazasiga kiritildi.
                </p>

                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 max-w-sm mx-auto mb-6">
                  <span className="text-xs text-sky-700 font-medium block">Maxsus kuzatuv kodingiz:</span>
                  <span className="text-2xl font-mono font-extrabold text-sky-900 tracking-wider">
                    {generatedCode}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-6">
                  Uşbu kodni saqlab qöying, murojaatingiz holatini tekşiriş uçun zarur böladi.
                </p>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchCode(generatedCode);
                      setActiveTab('check');
                    }}
                    className="px-5 py-2.5 bg-sky-800 text-white text-xs font-semibold rounded-lg hover:bg-sky-900"
                  >
                    Holatni tekşiriş
                  </button>
                  <button
                    onClick={() => setGeneratedCode(null)}
                    className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
                  >
                    Yana murojaat yoziş
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      F.I.O. (Familiya, Ism, Şarifingiz) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: Karimova Dilnoza"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telefon raqamingiz *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+998 90 123 45 67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Elektron poçta (ixtiyoriy)
                    </label>
                    <input
                      type="email"
                      placeholder="example@mail.uz"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Yaşaş manzilingiz (mahalla/qişloq)
                    </label>
                    <input
                      type="text"
                      placeholder="Qöşköpir tumani, Navröz mahallasi"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tegişli muassasa yoki bölim
                    </label>
                    <select
                      value={formData.organizationType}
                      onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                    >
                      <option value="Qo'shko'pir tumani MMTB">Qöşköpir tumani MMTB rahbariyati</option>
                      <option value="Maktabgacha ta'lim (Bog'chalar)">Maktabgaça ta'lim (Boğçalar böyiça)</option>
                      <option value="Umumiy o'rta ta'lim (Maktablar)">Umumiy örta ta'lim (Maktablar böyiça)</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.name}>{org.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Murojaat mavzusi *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: 1-sinfga qabul yoki tögaraklar"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Murojaat matni *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Murojaatingizni batafsil yozib qoldiring..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    * Yulduzça bilan belgilangan maydonlar töldirilişi şart
                  </span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-sky-800 hover:bg-sky-900 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Yuborilmoqda...' : 'Murojaatni yuboriş'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: Check Appeal Status */}
        {activeTab === 'check' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <form onSubmit={handleSearchAppeal} className="max-w-md mx-auto mb-6">
              <label className="block text-xs font-semibold text-slate-700 mb-2 text-center">
                Murojaat kuzatuv kodingizni kiriting:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Masalan: QSP-2026-4412"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm uppercase font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-800 hover:bg-sky-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Tekşiriş</span>
                </button>
              </div>
            </form>

            {hasSearched && (
              searchedAppeal ? (
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/70">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
                    <div>
                      <span className="text-xs text-slate-500 block">Kuzatuv kodi:</span>
                      <span className="font-mono font-bold text-sky-900 text-base">{searchedAppeal.trackingCode}</span>
                    </div>
                    <div>
                      {getStatusBadge(searchedAppeal.status)}
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-slate-700 mb-4">
                    <div>
                      <strong className="text-slate-900">Fuqaro:</strong> {searchedAppeal.fullName}
                    </div>
                    <div>
                      <strong className="text-slate-900">Sana:</strong> {searchedAppeal.date}
                    </div>
                    <div>
                      <strong className="text-slate-900">Mavzu:</strong> {searchedAppeal.subject}
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">Murojaat matni:</strong>
                      <p className="text-slate-600 italic">{searchedAppeal.message}</p>
                    </div>

                    {searchedAppeal.replyMessage && (
                      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl mt-3">
                        <div className="flex items-center justify-between mb-1 text-xs text-emerald-800 font-semibold">
                          <span>Rasmiy javob:</span>
                          <span>{searchedAppeal.replyDate}</span>
                        </div>
                        <p className="text-slate-800 font-medium mb-2">{searchedAppeal.replyMessage}</p>
                        {searchedAppeal.officer && (
                          <div className="text-[11px] text-emerald-900 font-semibold text-right">
                            — {searchedAppeal.officer}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p>Bunday kodli murojaat topilmadi. Kodni qayta tekşirib köring.</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};
