import React from 'react';
import { BellRing, ChevronRight } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const BreakingTicker: React.FC<{ onOpenNews?: () => void }> = ({ onOpenNews }) => {
  const { settings, t } = usePortal();

  if (!settings.marqueeText) return null;

  return (
    <div className="bg-amber-500 text-slate-950 text-xs font-medium py-1.5 px-4 overflow-hidden border-b border-amber-600">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-slate-950 text-amber-400 font-bold px-2 py-0.5 rounded text-[11px] shrink-0 uppercase tracking-wider">
          <BellRing className="w-3.5 h-3.5" />
          <span>{t("Muhim e'lon")}</span>
        </div>

        <div className="w3-marquee-wrapper overflow-hidden whitespace-nowrap flex-1 relative [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]">
          <p className="w3-marquee-track font-semibold cursor-default">
            {t(settings.marqueeText)}
          </p>
        </div>

        {onOpenNews && (
          <button
            onClick={onOpenNews}
            className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-900 hover:text-white shrink-0 uppercase tracking-wider"
          >
            <span>{t("Barcha e'lonlar")}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
