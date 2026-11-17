import React from 'react';
import { Terminal, Command } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'lessons' | 'terminal' | 'about') => void;
  onOpenShortcuts: () => void;
  onOpenSearch: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenShortcuts, onOpenSearch }) => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <img
              src="/img/transparent%20logo.png"
              alt="RootLab TV"
              className="h-11 w-32 rounded-lg object-cover object-center"
            />
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Personal notes on cybersecurity, networking, Linux, and web security. Part of the RootLab ecosystem.
            </p>
          </div>

          {/* Curriculum */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Curriculum
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('lessons')}
                  className="hover:text-emerald-500 transition-colors"
                >
                  Networking & Protocols
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lessons')}
                  className="hover:text-emerald-500 transition-colors"
                >
                  Linux Systems & Forensics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lessons')}
                  className="hover:text-emerald-500 transition-colors"
                >
                  Reconnaissance & Footprinting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lessons')}
                  className="hover:text-emerald-500 transition-colors"
                >
                  Web Security & OWASP
                </button>
              </li>
            </ul>
          </div>

          {/* Practice & Tools */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Interactive Tools
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('terminal')}
                  className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Terminal Sandbox</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSearch}
                  className="hover:text-emerald-500 transition-colors"
                >
                  Search Index (Ctrl+K)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenShortcuts}
                  className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
                >
                  <Command className="w-3 h-3" />
                  <span>Keyboard Shortcuts</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Ethics */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Ethical Standards
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              All materials are intended for defense, education, and authorized laboratory assessments.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('about')}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Read Learning Philosophy &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 RootLab Docs — Part of RootLab. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenShortcuts}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Shortcuts (<kbd className="font-mono text-[10px]">?</kbd>)
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('about')}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              About & Architecture
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
