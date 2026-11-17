import React from 'react';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { getAllLessons } from '../../lib/lessons';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (slug: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
}) => {
  const { bookmarkedLessons, toggleBookmark } = useLearning();
  const allLessons = getAllLessons();

  const savedLessons = allLessons.filter((l) => bookmarkedLessons.includes(l.slug));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              Saved Bookmarks ({savedLessons.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedLessons.length === 0 ? (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400">
              <Bookmark className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-sm font-medium">No bookmarked lessons yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Click the bookmark icon on any lesson to save it for quick reference later.
              </p>
            </div>
          ) : (
            savedLessons.map((lesson) => (
              <div
                key={lesson.slug}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 bg-slate-50 dark:bg-slate-950/40 transition-colors flex items-start justify-between gap-3 group"
              >
                <button
                  onClick={() => {
                    onSelectLesson(lesson.slug);
                    onClose();
                  }}
                  className="text-left flex-1 min-w-0"
                >
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    {lesson.category}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate mt-0.5 group-hover:text-emerald-500 transition-colors">
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                    {lesson.description}
                  </p>
                </button>
                <button
                  onClick={() => toggleBookmark(lesson.slug)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
