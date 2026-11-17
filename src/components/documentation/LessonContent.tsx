import React, { useEffect, useState, useRef } from 'react';
import {
  ChevronRight,
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  Share2,
  Check,
} from 'lucide-react';
import { Lesson } from '../../types';
import { MarkdownRenderer } from '../../lib/markdown';
import { getCategoryTrail } from '../../lib/lessons';
import { useLearning } from '../../context/LearningContext';
import { LessonChatBot } from './LessonChatBot';

interface LessonContentProps {
  lesson: Lesson;
  initialSectionId?: string;
  onSelectLesson: (slug: string) => void;
  onBackToLessons: () => void;
}

export const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  initialSectionId,
  onSelectLesson,
  onBackToLessons,
}) => {
  const { isCompleted, toggleComplete, isBookmarked, toggleBookmark, recordLessonView } = useLearning();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [shared, setShared] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const completed = isCompleted(lesson.slug);
  const bookmarked = isBookmarked(lesson.slug);
  const categoryTrail = getCategoryTrail(lesson.categorySlug);

  useEffect(() => {
    recordLessonView(lesson.slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (initialSectionId) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(initialSectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }
  }, [lesson.slug, initialSectionId]);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div ref={contentRef} className="relative mx-auto max-w-4xl pb-16">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-[2px] bg-transparent z-30 pointer-events-none">
        <div
          className="h-full bg-emerald-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <button
        onClick={onBackToLessons}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>All lessons</span>
      </button>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6">
        <span className="font-mono font-semibold">RootLab Docs</span>
        {categoryTrail.map((category) => (
          <React.Fragment key={category.id}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 whitespace-nowrap">{category.title}</span>
          </React.Fragment>
        ))}
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[200px] sm:max-w-none">
          {lesson.title}
        </span>
      </div>

      {/* Header and Controls */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2 text-right">
            <h1 className="w-full text-right text-3xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              {lesson.title}
            </h1>
            <p className="max-w-2xl text-right text-lg leading-8 text-slate-700 dark:text-slate-300 sm:ml-auto">
              {lesson.description}
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              onClick={() => toggleBookmark(lesson.slug)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                bookmarked
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Copy share link"
            >
              {shared ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{shared ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Clean unboxed metadata with typographic separators */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
          <span className="font-medium text-slate-700 dark:text-slate-300">{lesson.category}</span>
          <span aria-hidden="true">·</span>
          <span>Level: {lesson.difficulty || 'Beginner'}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{lesson.readTime}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Updated {lesson.updatedAt}</span>
          </span>
        </div>
      </div>

      {/* Main MDX Content */}
      <article className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 sm:px-8 sm:py-9">
        <MarkdownRenderer
          content={lesson.content}
          imageBasePath={`/${lesson.categorySlug}/`}
          onNavigateLesson={onSelectLesson}
        />
      </article>

      <LessonChatBot lessonText={lesson.content} />

      {/* Completion Banner */}
      <div className="mt-12 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {completed ? 'Lesson Completed!' : 'Finished studying this topic?'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {completed
              ? 'Great work! You can review notes anytime or proceed to the next module.'
              : 'Mark this lesson as completed to track your progress across the curriculum.'}
          </p>
        </div>

        <button
          onClick={() => toggleComplete(lesson.slug)}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
            completed
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
          }`}
        >
          {completed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Completed</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 text-slate-900" />
              <span>Mark as Completed</span>
            </>
          )}
        </button>
      </div>

      {/* Previous and Next Lesson Navigation */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {lesson.prevLesson ? (
          <button
            onClick={() => onSelectLesson(lesson.prevLesson!.slug)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 bg-white dark:bg-slate-900 text-left transition-all group"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Previous Lesson</span>
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {lesson.prevLesson.category}
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors mt-0.5 truncate">
              {lesson.prevLesson.title}
            </div>
          </button>
        ) : (
          <div />
        )}

        {lesson.nextLesson && (
          <button
            onClick={() => onSelectLesson(lesson.nextLesson!.slug)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 bg-white dark:bg-slate-900 text-right transition-all group sm:col-start-2"
          >
            <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Next Lesson</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {lesson.nextLesson.category}
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors mt-0.5 truncate">
              {lesson.nextLesson.title}
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
