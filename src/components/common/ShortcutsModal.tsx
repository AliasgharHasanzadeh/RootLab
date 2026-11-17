import React from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘ K / Ctrl K', desc: 'Open global search dialog' },
    { key: 'Esc', desc: 'Close dialogs, search, or drawers' },
    { key: '↑ / ↓', desc: 'Navigate search results or terminal command history' },
    { key: 'Tab', desc: 'Autocomplete supported command in terminal' },
    { key: 'Enter', desc: 'Execute command or select search item' },
    { key: '?', desc: 'Toggle keyboard shortcuts reference' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">{s.desc}</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-700">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-md"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
