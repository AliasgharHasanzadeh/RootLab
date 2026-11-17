import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Network,
  Terminal,
  Radar,
  ShieldAlert,
  Wrench,
  Folder,
  Search,
} from 'lucide-react';
import { CategoryGroup, LessonMetadata } from '../../types';
import { useLearning } from '../../context/LearningContext';

interface SidebarProps {
  categories: CategoryGroup[];
  activeSlug: string;
  onSelectLesson: (slug: string) => void;
  onCloseMobile?: () => void;
  hideRootCategoryHeader?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  activeSlug,
  onSelectLesson,
  onCloseMobile,
  hideRootCategoryHeader = false,
}) => {
  const { isCompleted, overallProgress, completedLessonsCount, totalLessonsCount } = useLearning();
  const [filterText, setFilterText] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (id: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Network':
        return <Network className="w-4 h-4" />;
      case 'Terminal':
        return <Terminal className="w-4 h-4" />;
      case 'Radar':
        return <Radar className="w-4 h-4" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4" />;
      case 'Wrench':
        return <Wrench className="w-4 h-4" />;
      default:
        return <Folder className="w-4 h-4" />;
    }
  };

  const renderCategory = (category: CategoryGroup, depth = 0): React.ReactNode => {
    const hideHeader = hideRootCategoryHeader && depth === 0;
    const containsActiveLesson = activeSlug && countLessons(category).some((lesson) => lesson.slug === activeSlug);
    const isCollapsed = !hideHeader && collapsedCategories[category.id] && !filterText && !containsActiveLesson;
    const filteredLessons = category.lessons.filter((lesson) =>
      lesson.title.toLowerCase().includes(filterText.toLowerCase()) ||
      lesson.description.toLowerCase().includes(filterText.toLowerCase())
    );
    const filteredChildren = (category.children || [])
      .map((child) => renderCategory(child, depth + 1))
      .filter(Boolean);
    const matchingLessonCount = filteredLessons.length + (category.children || []).reduce(
      (count, child) => count + countMatchingLessons(child, filterText.toLowerCase()),
      0
    );

    if (filterText && matchingLessonCount === 0) return null;

    const categoryCompletedCount = countLessons(category).filter((lesson) => isCompleted(lesson.slug)).length;
    const categoryLessonCount = countLessons(category).length;

    return (
      <div key={category.id} className="space-y-1" style={{ marginLeft: depth ? `${depth * 8}px` : undefined }}>
        {!hideHeader && <button
          onClick={() => toggleCategory(category.id)}
          className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200/50 dark:hover:bg-slate-900/60 transition-colors group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-emerald-600 dark:text-emerald-400 shrink-0">
              {getCategoryIcon(category.icon)}
            </span>
            <span className="tracking-tight truncate">{category.title}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
            <span className="text-[10px] font-mono">{categoryCompletedCount}/{categoryLessonCount}</span>
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>}

        {!isCollapsed && (
          <div className={hideHeader
            ? 'space-y-1'
            : 'space-y-1 pl-2 border-l border-slate-200 dark:border-slate-800 ml-3 mt-1'}>
            {filteredLessons.map((lesson) => {
              const isActive = lesson.slug === activeSlug;
              const completed = isCompleted(lesson.slug);
              return (
                <button
                  key={lesson.slug}
                  onClick={() => {
                    onSelectLesson(lesson.slug);
                    onCloseMobile?.();
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between group ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border-l-2 border-emerald-500 -ml-[9px] pl-3'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <span className="truncate pr-2">{lesson.title}</span>
                  {completed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : (
                    <Circle className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
            {filteredChildren}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-full h-full flex flex-col bg-slate-50/80 dark:bg-slate-950/70 border-r border-slate-200 dark:border-slate-800/80 select-none text-sm">
      {/* Search filter within sidebar */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800/70">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter curriculum..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Learning progress bar */}
        <div className="mt-3 px-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span>Curriculum Progress</span>
            <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
              {completedLessonsCount}/{totalLessonsCount} ({overallProgress}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Categories & Lessons List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {categories.map((category) => renderCategory(category))}
      </div>
    </aside>
  );
};

function countLessons(category: CategoryGroup): LessonMetadata[] {
  return [
    ...category.lessons,
    ...(category.children || []).flatMap((child) => countLessons(child)),
  ];
}

function countMatchingLessons(category: CategoryGroup, queryText: string): number {
  const query = category.lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(queryText) || lesson.description.toLowerCase().includes(queryText)
  ).length;
  return query + (category.children || []).reduce(
    (total, child) => total + countMatchingLessons(child, queryText),
    0
  );
}
