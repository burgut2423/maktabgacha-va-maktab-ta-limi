import React, { useState } from 'react';
import { Send, Search, CheckCircle2, Clock, AlertCircle, FileText, Phone, User, MapPin } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { CitizenAppeal } from '../../types';

export const VirtualReception: React.FC = () => {
  const { settings, appeals, submitCitizenAppeal, organizations, t } = usePortal();

  const defaultTarget = (settings.receptionTargets && settings.receptionTargets[0]) || settings.shortName || settings.districtName;
  const [activeTab, setActiveTab] = useState<'submit' | 'check'>('submit');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    organizationType: defaultTarget,
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
      alert(t("Iltimos, barcha majburiy maydonlarni to'ldiring."));
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
        organizationType: defaultTarget,
        subject: '',
        message: ''
      });
    } catch (err: any) {
      alert(t("Murojaatni yuborishda xatolik: ") + err.message);
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
            <span>{t("Ijro etildi (Javob berilgan)")}</span>
          </span>
        );
      case 'jarayonda':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            <span>{t("Ko'rib chiqish jarayonida")}</span>
          </span>
        );
      case 'rad_etildi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{t("Rad etilgan / Tushuntirish berilgan")}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
            <FileText className="w-3.5 h-3.5" />
            <span>{t("Yangi kelib tushgan")}</span>
          </span>
        );
    }
  };

  return (
    <section id="murojaat" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-wider font-semibold text-sky-800">
            {t(settings.receptionKicker || "Fuqarolar bilan muloqot")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {t(settings.receptionTitle || "Virtual qabulxona")}
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-xl mx-auto">
            {t(settings.receptionSubtitle)}
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
            {t("Yangi murojaat yuborish")}
          </button>
          <button
            onClick={() => setActiveTab('check')}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'check'
                ? 'border-sky-700 text-sky-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t("Murojaat holatini tekshirish")}
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
                  {t("Murojaatingiz muvaffaqiyatli qabul qilindi!")}
                </h3>
                <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
                  {t(`Murojaatingiz ${settings.shortName || settings.districtName} ro'yxatiga olindi va ma'lumotlar bazasiga kiritildi.`)}
                </p>

                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 max-w-sm mx-auto mb-6">
                  <span className="text-xs text-sky-700 font-medium block">{t("Maxsus kuzatuv kodingiz:")}</span>
                  <span className="text-2xl font-mono font-extrabold text-sky-900 tracking-wider">
                    {generatedCode}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-6">
                  {t("Ushbu kodni saqlab qo'ying, murojaatingiz holatini tekshirish uchun zarur bo'ladi.")}
                </p>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchCode(generatedCode);
                      setActiveTab('check');
                    }}
                    className="px-5 py-2.5 bg-sky-800 text-white text-xs font-semibold rounded-lg hover:bg-sky-900"
                  >
                    {t("Holatni tekshirish")}
                  </button>
                  <button
                    onClick={() => setGeneratedCode(null)}
                    className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
                  >
                    {t("Yana murojaat yozish")}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t("F.I.O. (Familiya, Ism, Sharifingiz) *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("Masalan: Karimova Dilnoza")}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t("Telefon raqamingiz *")}
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
                      {t("Elektron pochta (ixtiyoriy)")}
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
                      {t("Yashash manzilingiz (mahalla/qishloq)")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("Qo'shko'pir tumani, Navro'z mahallasi")}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t("Tegishli muassasa yoki bo'linma")}
                    </label>
                    <select
                      value={formData.organizationType}
                      onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                    >
                      {(settings.receptionTargets || []).map((target, idx) => (
                        <option key={idx} value={target}>{t(target)}</option>
                      ))}
                      {organizations.map(org => (
                        <option key={org.id} value={org.name}>{t(org.name)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t("Murojaat mavzusi *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("Masalan: 1-sinfga qabul yoki to'garaklar")}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t("Murojaat matni *")}
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder={t("Murojaatingizni batafsil yozib qoldiring...")}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {t("* Yulduzcha bilan belgilangan maydonlar to'ldirilishi shart")}
                  </span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-sky-800 hover:bg-sky-900 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? t('Yuborilmoqda...') : t('Murojaatni yuborish')}</span>
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
                {t("Murojaat kuzatuv kodingizni kiriting:")}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t("Masalan: ORG-2026-4412")}
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm uppercase font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-800 hover:bg-sky-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>{t("Tekshirish")}</span>
                </button>
              </div>
            </form>

            {hasSearched && (
              searchedAppeal ? (
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/70">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
                    <div>
                      <span className="text-xs text-slate-500 block">{t("Kuzatuv kodi:")}</span>
                      <span className="font-mono font-bold text-sky-900 text-base">{searchedAppeal.trackingCode}</span>
                    </div>
                    <div>
                      {getStatusBadge(searchedAppeal.status)}
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-slate-700 mb-4">
                    <div>
                      <strong className="text-slate-900">{t("Fuqaro:")}</strong> {t(searchedAppeal.fullName)}
                    </div>
                    <div>
                      <strong className="text-slate-900">{t("Sana:")}</strong> {searchedAppeal.date}
                    </div>
                    <div>
                      <strong className="text-slate-900">{t("Mavzu:")}</strong> {t(searchedAppeal.subject)}
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">{t("Murojaat matni:")}</strong>
                      <p className="text-slate-600 italic">{t(searchedAppeal.message)}</p>
                    </div>

                    {searchedAppeal.replyMessage && (
                      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl mt-3">
                        <div className="flex items-center justify-between mb-1 text-xs text-emerald-800 font-semibold">
                          <span>{t("Rasmiy javob:")}</span>
                          <span>{searchedAppeal.replyDate}</span>
                        </div>
                        <p className="text-slate-800 font-medium mb-2">{t(searchedAppeal.replyMessage)}</p>
                        {searchedAppeal.officer && (
                          <div className="text-[11px] text-emerald-900 font-semibold text-right">
                            — {t(searchedAppeal.officer)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p>{t("Bunday kodli murojaat topilmadi. Kodni qayta tekshirib ko'ring.")}</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};
