/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LearningProvider } from './context/LearningContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomeView } from './views/HomeView';
import { LessonsView } from './views/LessonsView';
import { TerminalView } from './views/TerminalView';
import { AboutView } from './views/AboutView';
import { SearchDialog } from './components/search/SearchDialog';
import { BookmarksDrawer } from './components/common/BookmarksDrawer';
import { ShortcutsModal } from './components/common/ShortcutsModal';

type ViewMode = 'home' | 'lessons' | 'terminal' | 'about';

function CyberVaultApp() {

  const initialPath = typeof window !== 'undefined'
    ? (window.location.hash.startsWith('#/') ? window.location.hash.slice(1) : window.location.pathname)
    : '/';

  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    if (initialPath.startsWith('/lessons/')) return 'lessons';
    if (initialPath === '/terminal') return 'terminal';
    if (initialPath === '/about') return 'about';
    return 'home';
  });

  const [activeSlug, setActiveSlug] = useState<string>(() => {
    if (initialPath.startsWith('/lessons/')) {
      return decodeURIComponent(initialPath.replace('/lessons/', ''));
    }
    return '';
  });
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>();

  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Synchronize the URL path with current view and active lesson
  useEffect(() => {
    if (currentView === 'home') {
      window.history.replaceState(null, '', '/');
    } else if (currentView === 'lessons') {
      const lessonPath = activeSlug ? `/lessons/${encodeURIComponent(activeSlug)}` : '/lessons';
      window.history.replaceState(null, '', `${lessonPath}${activeSectionId ? `#${encodeURIComponent(activeSectionId)}` : ''}`);
    } else if (currentView === 'terminal') {
      window.history.replaceState(null, '', '/terminal');
    } else if (currentView === 'about') {
      window.history.replaceState(null, '', '/about');
    }
  }, [currentView, activeSlug, activeSectionId]);

  // Global keyboard shortcuts (Ctrl+K / Cmd+K / ?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing inside an input or textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target?.tagName)) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectLesson = (slug: string, sectionId?: string) => {
    setActiveSlug(slug);
    setActiveSectionId(sectionId);
    setCurrentView('lessons');
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors" dir="ltr">
      {/* Top Bar Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenBookmarks={() => setBookmarksOpen(true)}
        onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        showMobileSidebarToggle={currentView === 'lessons'}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={(view) => setCurrentView(view)}
            onSelectLesson={handleSelectLesson}
            onOpenSearch={() => setSearchOpen(true)}
          />
        )}

        {currentView === 'lessons' && (
          <LessonsView
            activeSlug={activeSlug}
            activeSectionId={activeSectionId}
            onSelectLesson={handleSelectLesson}
            onBackToLessons={() => {
              setActiveSlug('');
              setCurrentView('lessons');
            }}
            onOpenSearch={() => setSearchOpen(true)}
            mobileSidebarOpen={mobileSidebarOpen}
            onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
          />
        )}

        {currentView === 'terminal' && (
          <TerminalView />
        )}

        {currentView === 'about' && <AboutView />}
      </div>

      {/* Footer */}
      {currentView !== 'home' && (
        <Footer
          onNavigate={(view) => setCurrentView(view)}
          onOpenShortcuts={() => setShortcutsOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />
      )}

      {/* Global Modals & Drawers */}
      <SearchDialog
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectLesson={handleSelectLesson}
      />

      <BookmarksDrawer
        isOpen={bookmarksOpen}
        onClose={() => setBookmarksOpen(false)}
        onSelectLesson={handleSelectLesson}
      />

      <ShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LearningProvider>
          <CyberVaultApp />
        </LearningProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
