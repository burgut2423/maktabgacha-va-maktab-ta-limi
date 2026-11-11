import React, { useState } from 'react';
import { Calendar, Eye, User, ArrowRight, Share2, Volume2, X } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { NewsItem } from '../../types';

interface NewsSectionProps {
  selectedNews: NewsItem | null;
  onSelectNews: (news: NewsItem | null) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ selectedNews, onSelectNews }) => {
  const { news, speakText } = usePortal();
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');

  const categories = ['Barchasi', 'Boshqaruv', 'MTT', 'Pedagogika', 'Olimpiada', 'E\'lon'];

  const filteredNews = selectedCategory === 'Barchasi'
    ? news
    : news.filter(n => n.category === selectedCategory);

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
          {filteredNews.map(item => (
            <article
              key={item.id}
              onClick={() => onSelectNews(item)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
            >
              <div className="h-48 w-full overflow-hidden relative bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                  {item.category}
                </div>
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
                    <span>O'qish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500">Ushbu toifada hozircha yangiliklar mavjud emas.</p>
          </div>
        )}
      </div>

      {/* Full Article Modal Reader */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 my-8">
            <div className="relative h-64 sm:h-80 w-full bg-slate-900">
              <img
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => onSelectNews(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors"
                aria-label="Yopish"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-sky-700 text-white text-xs font-semibold px-3 py-1 rounded">
                {selectedNews.category}
              </div>
            </div>

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
                    onClick={() => speakText(`${selectedNews.title}. ${selectedNews.content}`)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                    title="Ovozli o'qish"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Ovozli eshitish</span>
                  </button>
                  <button
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

              <div className="text-sm sm:text-base font-medium text-slate-700 bg-sky-50/70 p-4 rounded-xl border border-sky-100 mb-6 leading-relaxed">
                {selectedNews.summary}
              </div>

              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedNews.content}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
                <button
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
    </section>
  );
};
