import React, { useRef, useState } from 'react';
import { Sidebar } from '../components/documentation/Sidebar';
import { LessonContent } from '../components/documentation/LessonContent';
import { TableOfContents } from '../components/documentation/TableOfContents';
import { getAllCategories, getLessonBySlug, getAllLessons, getCategoryCover } from '../lib/lessons';
import { CategoryGroup } from '../types';
import { BookOpen, X, AlignLeft, Folder, ArrowLeft } from 'lucide-react';

interface LessonsViewProps {
  activeSlug: string;
  activeSectionId?: string;
  onSelectLesson: (slug: string) => void;
  onBackToLessons: () => void;
  onOpenSearch: () => void;
  mobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  activeSlug,
  activeSectionId,
  onSelectLesson,
  onBackToLessons,
  onOpenSearch,
  mobileSidebarOpen,
  onCloseMobileSidebar,
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const isResizingSidebar = useRef(false);
  const categories = getAllCategories();
  const currentLesson = getLessonBySlug(activeSlug);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const selectedCategory = selectedCategoryId ? findCategory(categories, selectedCategoryId) : undefined;
  const selectedRootCategory = selectedCategoryId
    ? categories.find((category) => category.id === selectedCategoryId.split('/')[0])
    : undefined;
  const lessonFolderParts = currentLesson?.categorySlug.split('/') || [];
  const activeLessonCategoryId = currentLesson
    ? lessonFolderParts.slice(0, Math.min(2, lessonFolderParts.length)).join('/')
    : null;
  const activeLessonCategory = activeLessonCategoryId
    ? findCategory(categories, activeLessonCategoryId)
    : undefined;
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const selectLesson = (slug: string) => {
    onSelectLesson(slug);
  };
  const backToAllLessons = () => {
    setSelectedCategoryId(null);
    onBackToLessons();
  };
  const sidebarCategory = currentLesson
    ? activeLessonCategory
    : selectedCategory || selectedRootCategory;
  const sidebarCategories = sidebarCategory ? [sidebarCategory] : categories;
  const handleSidebarResize = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isResizingSidebar.current) {
      setSidebarWidth(Math.min(480, Math.max(220, event.clientX)));
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row relative">
      {/* Mobile Drawer Overlay for Sidebar */}
      {mobileSidebarOpen && (currentLesson || selectedCategory) && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobileSidebar}
        >
          <div
            className="w-72 sm:w-80 h-full bg-white dark:bg-slate-950 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Documentation Menu
              </span>
              <button
                onClick={onCloseMobileSidebar}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="h-[calc(100%-48px)]">
              <Sidebar
                categories={sidebarCategories}
                activeSlug={currentLesson?.slug || ''}
                onSelectLesson={selectLesson}
                onCloseMobile={onCloseMobileSidebar}
                hideRootCategoryHeader={!!currentLesson || !!selectedCategory}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar: sticky, fixed width */}
      {(currentLesson || selectedCategory) && (
        <div
          className="relative hidden lg:block shrink-0 border-r border-slate-200 dark:border-slate-800/80 sticky top-16 h-[calc(100vh-4rem)] overflow-visible"
          style={{ width: sidebarWidth }}
        >
          <Sidebar
            categories={sidebarCategories}
            activeSlug={currentLesson?.slug || ''}
            onSelectLesson={selectLesson}
            hideRootCategoryHeader={!!currentLesson || !!selectedCategory}
          />
          <div
            role="separator"
            aria-label="Resize lesson sidebar"
            aria-orientation="vertical"
            aria-valuemin={220}
            aria-valuemax={480}
            aria-valuenow={sidebarWidth}
            tabIndex={0}
            onPointerDown={(event) => {
              isResizingSidebar.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={handleSidebarResize}
            onPointerUp={() => { isResizingSidebar.current = false; }}
            onPointerCancel={() => { isResizingSidebar.current = false; }}
            onLostPointerCapture={() => { isResizingSidebar.current = false; }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') setSidebarWidth((width) => Math.max(220, width - 16));
              if (event.key === 'ArrowRight') setSidebarWidth((width) => Math.min(480, width + 16));
            }}
            className="absolute -right-1 top-0 z-20 h-full w-2 cursor-col-resize touch-none bg-transparent transition-colors hover:bg-emerald-500/30 focus-visible:bg-emerald-500/30 focus-visible:outline-none"
          />
        </div>
      )}

      {/* Center Main Content Area */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 overflow-y-auto">
        {/* Mobile TOC Quick Toggle Button */}
        {currentLesson && currentLesson.headings.length > 0 && (
          <div className="xl:hidden mb-6 flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-emerald-500" />
              <span>Table of Contents ({currentLesson.headings.length} sections)</span>
            </span>
            <button
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="text-emerald-600 dark:text-emerald-400 font-semibold"
            >
              {mobileTocOpen ? 'Hide' : 'Show'}
            </button>
          </div>
        )}

        {/* Collapsible Mobile TOC */}
        {mobileTocOpen && currentLesson && (
          <div className="xl:hidden mb-6 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <TableOfContents headings={currentLesson.headings} />
          </div>
        )}

        {/* Lesson Content or 404 Empty State */}
        {currentLesson ? (
          <LessonContent
            lesson={currentLesson}
            initialSectionId={activeSectionId}
            onSelectLesson={onSelectLesson}
            onBackToLessons={backToAllLessons}
          />
        ) : selectedCategory ? (
          <section className="max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedCategoryId(selectedCategory.id.includes('/')
                ? selectedCategory.id.split('/').slice(0, -1).join('/')
                : null)}
              className="mb-6 inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> {selectedCategory.id.includes('/') ? 'پوشه قبلی' : 'همه پوشه‌ها'}
            </button>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{selectedCategory.title}</h1>
            {selectedCategory.children?.length ? (
              <>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 mb-8">یک پوشه را انتخاب کنید یا درس را از سایدبار باز کنید.</p>
              </>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">برای باز کردن درس، آن را از سایدبار انتخاب کنید.</p>
            )}
          </section>
        ) : categories.length > 0 ? (
          <section className="max-w-5xl mx-auto space-y-10">
            {categories.map((category) => {
              const folders = category.children?.length ? category.children : [category];
              return (
                <section key={category.id}>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{category.title}</h1>
                  {category.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{category.description}</p>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => setSelectedCategoryId(folder.id)}
                        className="group relative h-40 overflow-hidden text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 transition-colors"
                      >
                        <CategoryFolderIcon category={folder} lessonCount={countCategoryLessons(folder)} />
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </section>
        ) : (
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Lesson Not Found</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The requested lesson slug does not exist or may have been reorganized.
            </p>
            <button
              onClick={() => {
                const first = getAllLessons()[0];
                if (first) onSelectLesson(first.slug);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md"
            >
              Go to First Lesson
            </button>
          </div>
        )}
      </main>

      {/* Desktop Right Sidebar: Table of Contents */}
      {currentLesson && currentLesson.headings.length > 0 && (
        <div className="hidden xl:block w-64 shrink-0 p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <TableOfContents headings={currentLesson.headings} />
        </div>
      )}
    </div>
  );
};

function countCategoryLessons(category: CategoryGroup): number {
  return category.lessons.length + (category.children || []).reduce((total, child) => total + countCategoryLessons(child), 0);
}

function CategoryFolderIcon({ category, lessonCount }: { category: CategoryGroup; lessonCount: number }) {
  const extensions = ['png', 'jpg', 'jpeg', 'webp', 'svg'];
  const candidates = [
    getCategoryCover(category.id),
    ...extensions.map((extension) => `/${category.id}/1.${extension}`),
  ].filter((source): source is string => Boolean(source));
  const [candidateIndex, setCandidateIndex] = useState(0);

  if (candidateIndex >= candidates.length) {
    return (
      <div className="p-4">
        <Folder className="mb-4 h-6 w-6 text-emerald-500" />
        <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{category.title}</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{lessonCount} درس</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <img
        src={candidates[candidateIndex]}
        alt={`${category.title} icon`}
        loading="lazy"
        onError={() => setCandidateIndex((index) => index + 1)}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
      <div className="absolute bottom-3 left-4 z-10 text-left text-white drop-shadow">
        <h2 className="font-semibold text-lg">{category.title}</h2>
        <p className="mt-1 text-sm text-white/80">{lessonCount} درس</p>
      </div>
    </div>
  );
}

function findCategory(categories: CategoryGroup[], id: string): CategoryGroup | undefined {
  for (const category of categories) {
    if (category.id === id) return category;
    const nested = findCategory(category.children || [], id);
    if (nested) return nested;
  }
  return undefined;
}
