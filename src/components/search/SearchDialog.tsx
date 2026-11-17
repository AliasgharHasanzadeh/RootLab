import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';
import { searchLessons } from '../../lib/search';
import { SearchResult } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (slug: string, sectionId?: string) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
}) => {
  const { isFa } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    const found = searchLessons(query);
    setResults(found);
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        if (results[selectedIndex]) {
          e.preventDefault();
          onSelectLesson(results[selectedIndex].slug, results[selectedIndex].sectionId);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onSelectLesson]);

  if (!isOpen) return null;

  const quickTerms = isFa
    ? ['مدل OSI', 'پورت اسکن', 'ان‌مپ', 'پرمیشن لینوکس', 'اوآسپ', 'وایرسارک', 'کوکی و نشست', 'سابنت']
    : ['OSI Model', 'TCP Handshake', 'DNSSEC', 'CIDR', 'Linux Permissions', 'Nmap SYN', 'OWASP', 'Wireshark'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isFa
                ? 'جستجوی درس‌ها، دستورات، پروتکل‌ها یا مفاهیم به فارسی یا انگلیسی...'
                : 'Search lessons, topics, commands, or concepts...'
            }
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-400 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {query.trim().length > 0 && results.length === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              <p>
                {isFa
                  ? `موردی برای «${query}» یافت نشد`
                  : `No results found for "${query}"`}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isFa
                  ? 'کلماتی مانند شبکه، لینوکس، ان‌مپ، دی‌ان‌اس، یا وایرسارک را جستجو کنید.'
                  : 'Try searching for protocols (DNS, TCP), tools (Nmap, Wireshark), or Linux commands.'}
              </p>
            </div>
          )}

          {query.trim().length === 0 && (
            <div className="py-6 px-4 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {isFa ? 'پیشنهادهای جستجو:' : 'Quick suggestions:'}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {quickTerms.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:bg-emerald-950/40 rounded transition-colors text-slate-600 dark:text-slate-300"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={item.slug}
                onClick={() => {
                  onSelectLesson(item.slug, item.sectionId);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-start justify-between gap-4 ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      {item.category}
                    </span>
                    <span className="text-slate-400 text-xs">·</span>
                    <span className="text-xs text-slate-400 capitalize">
                      {isFa ? 'نتیجه مرتبط' : `${item.matchType} match`}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
                <ArrowRight
                  className={`w-4 h-4 shrink-0 transition-opacity mt-2 ${
                    isSelected ? 'opacity-100 text-emerald-500' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono">↑↓</kbd> {isFa ? 'حرکت' : 'to navigate'}
            </span>
            <span>
              <kbd className="font-mono">↵</kbd> {isFa ? 'انتخاب' : 'to select'}
            </span>
            <span>
              <kbd className="font-mono">esc</kbd> {isFa ? 'بستن' : 'to close'}
            </span>
          </div>
          <span>
            {results.length} {isFa ? 'نتیجه' : `result${results.length === 1 ? '' : 's'}`}
          </span>
        </div>
      </div>
    </div>
  );
};
