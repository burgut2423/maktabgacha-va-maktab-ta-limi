import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Eye,
  User,
  ArrowRight,
  Share2,
  Volume2,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FolderOpen,
  Images,
  ExternalLink
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { NewsItem } from '../../types';
import { PORTAL_CONFIG } from '../../config/portalConfig';
import { heroImage } from '../../assets/images';

interface NewsSectionProps {
  selectedNews: NewsItem | null;
  onSelectNews: (news: NewsItem | null) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ selectedNews, onSelectNews }) => {
  const { news, speakText } = usePortal();
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const categories = ['Barchasi', 'Boshqaruv', 'MTT', 'Pedagogika', 'Olimpiada', 'E\'lon'];

  const filteredNews = selectedCategory === 'Barchasi'
    ? news
    : news.filter(n => n.category === selectedCategory);

  // Reset active image index when switching or opening article
  useEffect(() => {
    setActiveImageIndex(0);
    setIsLightboxOpen(false);
  }, [selectedNews?.id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedNews) return;
    const gallery = (selectedNews.images && selectedNews.images.length > 0)
      ? selectedNews.images
      : (selectedNews.imageUrl ? [selectedNews.imageUrl] : []);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onSelectNews(null);
        }
      } else if (e.key === 'ArrowRight' && gallery.length > 1) {
        setActiveImageIndex(prev => (prev + 1) % gallery.length);
      } else if (e.key === 'ArrowLeft' && gallery.length > 1) {
        setActiveImageIndex(prev => (prev - 1 + gallery.length) % gallery.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNews, isLightboxOpen]);

  const handleShare = (item: NewsItem) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.summary,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Havola nusxalandi!");
    }
  };

  const currentGallery = selectedNews
    ? ((selectedNews.images && selectedNews.images.length > 0)
        ? selectedNews.images
        : (selectedNews.imageUrl ? [selectedNews.imageUrl] : []))
    : [];

  const driveLink = selectedNews?.driveFolderUrl || PORTAL_CONFIG.DEFAULT_DRIVE_FOLDER_URL;

  return (
    <section id="yangiliklar" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-sky-800">
              Axborot xizmati
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Yangiliklar va rasmiy xabarlar
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Qo'shko'pir tumani maktabgacha va maktab ta'limi tizimidagi muhim voqealar
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-sky-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map(item => {
            const hasMultipleImages = (item.images && item.images.length > 1);
            const imageCount = item.images?.length || 1;
            const cardImg = (item.images && item.images[0]) || item.imageUrl;

            return (
              <article
                key={item.id}
                onClick={() => onSelectNews(item)}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
              >
                <div className="h-48 w-full overflow-hidden relative bg-slate-100">
                  <img
                    src={cardImg}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = heroImage;
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                    {item.category}
                  </div>

                  {/* Multi-image indicator badge */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-2.5 right-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                      <Images className="w-3.5 h-3.5 text-sky-400" />
                      <span>{imageCount} ta rasm</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{item.views}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{item.author}</span>
                    <span className="text-sky-700 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>O'qish va galereya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500">Ushbu toifada hozircha yangiliklar mavjud emas.</p>
          </div>
        )}
      </div>

      {/* Full Article Modal Reader with Interactive Image Gallery */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 my-6">
            
            {/* Gallery Main Viewer */}
            <div className="relative w-full bg-slate-950 select-none group">
              <div className="relative h-64 sm:h-96 md:h-[420px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
                <img
                  src={currentGallery[activeImageIndex] || selectedNews.imageUrl}
                  alt={`${selectedNews.title} - Rasm ${activeImageIndex + 1}`}
                  className="w-full h-full object-contain cursor-zoom-in transition-all duration-200"
                  referrerPolicy="no-referrer"
                  onClick={() => setIsLightboxOpen(true)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = heroImage;
                  }}
                />

                {/* Left navigation arrow */}
                {currentGallery.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((activeImageIndex - 1 + currentGallery.length) % currentGallery.length);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white transition-all backdrop-blur-xs shadow-lg hover:scale-105 active:scale-95"
                    aria-label="Oldingi rasm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {/* Right navigation arrow */}
                {currentGallery.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((activeImageIndex + 1) % currentGallery.length);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white transition-all backdrop-blur-xs shadow-lg hover:scale-105 active:scale-95"
                    aria-label="Keyingi rasm"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}

                {/* Top Action Buttons (Close & Lightbox) */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white transition-colors backdrop-blur-xs"
                    title="Kattalashtirish (Fullscreen)"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectNews(null)}
                    className="p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white transition-colors backdrop-blur-xs"
                    aria-label="Yopish"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Badges: Category & Gallery Counter */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="bg-sky-700/90 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded shadow-sm">
                    {selectedNews.category}
                  </div>
                  {currentGallery.length > 1 && (
                    <div className="bg-black/75 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded shadow-sm flex items-center gap-1">
                      <Images className="w-3.5 h-3.5 text-sky-400" />
                      <span>{activeImageIndex + 1} / {currentGallery.length} rasm</span>
                    </div>
                  )}
                </div>

                {/* Bottom Bar on Main Image */}
                <div className="absolute bottom-3 right-3">
                  {driveLink && (
                    <a
                      href={driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-medium backdrop-blur-xs transition-colors border border-white/20"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>Drive jildini ochish</span>
                      <ExternalLink className="w-3 h-3 text-slate-300" />
                    </a>
                  )}
                </div>
              </div>

              {/* Thumbnails Strip */}
              {currentGallery.length > 1 && (
                <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-thin">
                  {currentGallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-900 scale-105 opacity-100'
                          : 'opacity-50 hover:opacity-90'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Miniatura ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-b border-slate-200 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{selectedNews.date}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{selectedNews.author}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span>{selectedNews.views} marta ko'rildi</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakText(`${selectedNews.title}. ${selectedNews.content}`)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                    title="Ovozli o'qish"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Ovozli eshitish</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare(selectedNews)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                    title="Ulashish"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Ulashish</span>
                  </button>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-4">
                {selectedNews.title}
              </h1>

              {selectedNews.summary && (
                <div className="text-sm sm:text-base font-medium text-slate-700 bg-sky-50/70 p-4 rounded-xl border border-sky-100 mb-6 leading-relaxed">
                  {selectedNews.summary}
                </div>
              )}

              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedNews.content}
              </div>

              {/* Gallery Grid Preview inside Article Body */}
              {currentGallery.length > 1 && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Images className="w-4 h-4 text-sky-700" />
                    <span>Fotolavhalar to'plami ({currentGallery.length} ta rasm):</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {currentGallery.map((imgUrl, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setActiveImageIndex(i);
                          setIsLightboxOpen(true);
                        }}
                        className={`group relative h-28 sm:h-32 rounded-xl overflow-hidden cursor-pointer border border-slate-200 shadow-2xs hover:shadow-md transition-all ${
                          activeImageIndex === i ? 'ring-2 ring-sky-600' : ''
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Rasm ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/70 text-[10px] text-white px-1.5 py-0.5 rounded">
                          {i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                {driveLink ? (
                  <a
                    href={driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-sky-700 hover:text-sky-900 font-semibold"
                  >
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                    <span>Rasmlar papkasi (Google Drive)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : <span />}

                <button
                  type="button"
                  onClick={() => onSelectNews(null)}
                  className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {selectedNews && isLightboxOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex flex-col justify-between p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white py-2" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-200">
                {selectedNews.title}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-sky-300">
                {activeImageIndex + 1} / {currentGallery.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Yopish (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Center Image & Arrows */}
          <div className="relative flex-1 flex items-center justify-center p-2" onClick={e => e.stopPropagation()}>
            {currentGallery.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveImageIndex((activeImageIndex - 1 + currentGallery.length) % currentGallery.length)}
                className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-transform hover:scale-110"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            <img
              src={currentGallery[activeImageIndex] || selectedNews.imageUrl}
              alt={`${selectedNews.title} katta rasm`}
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />

            {currentGallery.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveImageIndex((activeImageIndex + 1) % currentGallery.length)}
                className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-transform hover:scale-110"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Strip */}
          <div className="py-2 flex items-center justify-center gap-2 overflow-x-auto" onClick={e => e.stopPropagation()}>
            {currentGallery.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`w-12 h-9 sm:w-16 sm:h-12 rounded overflow-hidden shrink-0 transition-all ${
                  activeImageIndex === idx ? 'ring-2 ring-sky-400 scale-105 opacity-100' : 'opacity-40 hover:opacity-80'
                }`}
              >
                <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
