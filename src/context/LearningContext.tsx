import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { ALL_LESSONS } from '../lib/lessons';

interface LearningContextType {
  completedLessons: string[];
  bookmarkedLessons: string[];
  recentSlugs: string[];
  toggleComplete: (slug: string) => void;
  isCompleted: (slug: string) => boolean;
  toggleBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
  recordLessonView: (slug: string) => void;
  overallProgress: number; // 0 to 100
  totalLessonsCount: number;
  completedLessonsCount: number;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cybervault-completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cybervault-bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentSlugs, setRecentSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cybervault-recents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cybervault-completed', JSON.stringify(completedLessons));
    } catch {}
  }, [completedLessons]);

  useEffect(() => {
    try {
      localStorage.setItem('cybervault-bookmarks', JSON.stringify(bookmarkedLessons));
    } catch {}
  }, [bookmarkedLessons]);

  useEffect(() => {
    try {
      localStorage.setItem('cybervault-recents', JSON.stringify(recentSlugs));
    } catch {}
  }, [recentSlugs]);

  const toggleComplete = (slug: string) => {
    setCompletedLessons((prev) => {
      const exists = prev.includes(slug);
      if (!exists) {
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#10B981', '#06B6D4', '#3B82F6'],
          });
        } catch {}
        return [...prev, slug];
      }
      return prev.filter((s) => s !== slug);
    });
  };

  const isCompleted = (slug: string) => completedLessons.includes(slug);

  const toggleBookmark = (slug: string) => {
    setBookmarkedLessons((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const isBookmarked = (slug: string) => bookmarkedLessons.includes(slug);

  const recordLessonView = (slug: string) => {
    setRecentSlugs((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered].slice(0, 10);
    });
  };

  const totalLessonsCount = ALL_LESSONS.length;
  const completedLessonsCount = completedLessons.filter((slug) =>
    ALL_LESSONS.some((l) => l.slug === slug)
  ).length;

  const overallProgress =
    totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

  return (
    <LearningContext.Provider
      value={{
        completedLessons,
        bookmarkedLessons,
        recentSlugs,
        toggleComplete,
        isCompleted,
        toggleBookmark,
        isBookmarked,
        recordLessonView,
        overallProgress,
        totalLessonsCount,
        completedLessonsCount,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export function useLearning(): LearningContextType {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}
