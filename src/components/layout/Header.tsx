import React, { useState } from 'react';
import {
  Search,
  Terminal,
  Bookmark,
  Sun,
  Moon,
  Github,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLearning } from '../../context/LearningContext';

interface HeaderProps {
  currentView: 'home' | 'lessons' | 'terminal' | 'about';
  onNavigate: (view: 'home' | 'lessons' | 'terminal' | 'about') => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onToggleMobileSidebar?: () => void;
  showMobileSidebarToggle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onOpenBookmarks,
  onToggleMobileSidebar,
  showMobileSidebarToggle = false,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { bookmarkedLessons, overallProgress } = useLearning();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'lessons' | 'terminal' | 'about') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          {showMobileSidebarToggle && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-1.5 -ml-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md"
              aria-label="Toggle lessons navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group shrink-0"
          >
            <img
              src="/img/transparent%20logo.png"
              alt="RootLab TV"
              className="h-12 w-36 rounded-lg object-cover object-center"
            />
          </button>
        </div>

        {/* Zone 2: Navigation Links (English) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => handleNavClick('home')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-slate-900 dark:hover:text-white ${
              currentView === 'home'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('lessons')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-slate-900 dark:hover:text-white ${
              currentView === 'lessons'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : ''
            }`}
          >
            Lessons
          </button>
          <button
            onClick={() => handleNavClick('terminal')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white ${
              currentView === 'terminal'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : ''
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span>Terminal</span>
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-slate-900 dark:hover:text-white ${
              currentView === 'about'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : ''
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {/* Global Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md transition-colors"
            title="Search documentation (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search notes...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Bookmarks Toggle */}
          <button
            onClick={onOpenBookmarks}
            className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title="Saved bookmarks"
            aria-label="View bookmarks"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarkedLessons.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer noopener"
            className="hidden sm:flex items-center p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title="GitHub Repository"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Primary Action Button */}
          <button
            onClick={() => handleNavClick('lessons')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Lessons</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown (English) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className="block w-full text-left py-2 px-3 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('lessons')}
            className="block w-full text-left py-2 px-3 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            Lessons ({overallProgress}% completed)
          </button>
          <button
            onClick={() => handleNavClick('terminal')}
            className="block w-full text-left py-2 px-3 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 flex items-center justify-between"
          >
            <span>Interactive Terminal</span>
            <span className="text-xs text-emerald-500 font-mono">CLI</span>
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="block w-full text-left py-2 px-3 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            About
          </button>
        </div>
      )}
    </header>
  );
};
