import React from 'react';
import { ArrowRight, BookOpen, Terminal } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TerminalSimulator } from '../components/terminal/TerminalSimulator';

interface HomeViewProps {
  onNavigate: (view: 'home' | 'lessons' | 'terminal' | 'about') => void;
  onSelectLesson: (slug: string) => void;
  onOpenSearch?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { overallProgress, completedLessonsCount, totalLessonsCount } = useLearning();

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] flex items-center px-5 sm:px-8 xl:px-12 py-10">
      <section className="home-enter w-full min-w-0 max-w-[1600px] mx-auto grid items-center gap-10 lg:grid-cols-2 xl:gap-16">
        <div className="min-w-0 space-y-7 text-center lg:pr-4 lg:text-left xl:pr-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            RootLab Docs
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.08] text-slate-900 dark:text-slate-100 text-balance">
              I'm Here to Make Your Path Easier.
            </h1>
            <p className="mx-auto max-w-lg text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-slate-400 lg:mx-0">
              Practical notes and guides on Linux, networking, and cybersecurity to make your learning journey easier.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => onNavigate('lessons')}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-5 py-3 text-base font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
            >
              <BookOpen className="h-4 w-4" />
              Browse lessons
            </button>
            <button
              onClick={() => onNavigate('terminal')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Terminal className="h-4 w-4 text-emerald-500" />
              Full terminal
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {completedLessonsCount > 0 && (
            <div className="max-w-md border-t border-slate-200 pt-5 text-sm dark:border-slate-800">
              <div className="mb-3 flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400">
                <span>Learning progress</span>
                <span>{completedLessonsCount}/{totalLessonsCount} lessons - {overallProgress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="w-full min-w-0 px-1 sm:px-2 lg:px-0">
          <TerminalSimulator compact />
        </div>

      </section>
    </main>
  );
};
