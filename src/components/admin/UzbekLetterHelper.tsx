import React from 'react';
import { SpellCheck, Sparkles } from 'lucide-react';
import { fixUzbekText, UZBEK_LETTERS } from '../../utils/uzbekTypography';

interface UzbekLetterHelperProps {
  onInsertLetter: (letter: string) => void;
  onAutoFix?: () => void;
  compact?: boolean;
}

export const UzbekLetterHelper: React.FC<UzbekLetterHelperProps> = ({
  onInsertLetter,
  onAutoFix,
  compact = false
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 rounded-lg border border-slate-200 text-xs ${compact ? 'py-1' : ''}`}>
      <span className="font-semibold text-slate-600 flex items-center gap-1 mr-1">
        <SpellCheck className="w-3.5 h-3.5 text-sky-600" />
        <span className="hidden sm:inline">Özbek harflari:</span>
      </span>

      {UZBEK_LETTERS.map(letter => (
        <button
          key={letter}
          type="button"
          onClick={() => onInsertLetter(letter)}
          className="px-2 py-0.5 bg-white hover:bg-sky-50 text-slate-800 hover:text-sky-700 font-mono font-medium rounded border border-slate-300 hover:border-sky-400 shadow-xs transition-all active:scale-95"
          title={`"${letter}" harfini kiritiş`}
        >
          {letter}
        </button>
      ))}

      {onAutoFix && (
        <button
          type="button"
          onClick={onAutoFix}
          className="ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium shadow-xs transition-colors"
          title="Matndagi o' va g' belgilarni yangi alifbodagi ö va ğ harflariga avtomatik töğrilaş"
        >
          <Sparkles className="w-3 h-3" />
          <span>Imloni töğrilaş</span>
        </button>
      )}
    </div>
  );
};
