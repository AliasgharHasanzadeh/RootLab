import React, { useEffect, useState } from 'react';
import { HeadingItem } from '../../types';
import { AlignLeft } from 'lucide-react';

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: '-80px 0% -60% 0%',
        threshold: 0,
      }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <div className="w-full text-xs">
      <div className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white">
        <AlignLeft className="w-3.5 h-3.5 text-emerald-500" />
        <span>On this page</span>
      </div>

      <nav className="space-y-2 border-l border-slate-300 dark:border-slate-700">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const paddingLeft =
            heading.level === 1 ? 'pl-3' : heading.level === 2 ? 'pl-4' : 'pl-6';

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => scrollToHeading(heading.id, e)}
              className={`block py-1 text-xs transition-colors truncate -ml-[1px] border-l ${paddingLeft} ${
                isActive
                  ? 'border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {heading.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
};
