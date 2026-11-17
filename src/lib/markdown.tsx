import React, { useState } from 'react';
import {
  Copy,
  Check,
  Info,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  Hash,
  ChevronDown,
  ChevronUp,
  Pin,
} from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  imageBasePath?: string;
  onNavigateLesson?: (slug: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  imageBasePath,
  onNavigateLesson,
}) => {
  const renderedElements = parseMarkdownToReact(content, {
    imageBasePath,
    onNavigateLesson,
  });

  return (
    <div className="prose-vault text-base leading-8 text-slate-800 dark:text-slate-200">
      {renderedElements}
    </div>
  );
};

interface RenderContext {
  imageBasePath?: string;
  onNavigateLesson?: (slug: string) => void;
}

function parseMarkdownToReact(markdown: string, ctx: RenderContext): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  const lines = markdown.split(/\r?\n/);
  const headingIdCounts = new Map<string, number>();
  let i = 0;
  let keyIndex = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Standalone Markdown image, optionally with a title used as its caption.
    const imageMatch = line.trim().match(/^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)$/);
    if (imageMatch) {
      const [, alt, source, caption] = imageMatch;
      const src = resolveImageSource(source, ctx.imageBasePath);
      elements.push(
        <figure key={`image-${keyIndex++}`} className="my-6 space-y-2 text-center">
          <img src={src} alt={alt} loading="lazy" className="mx-auto max-h-[36rem] max-w-full rounded-xl border border-slate-200 dark:border-slate-800 object-contain shadow-sm" />
          {caption && <figcaption className="text-sm text-slate-500 dark:text-slate-400">{caption}</figcaption>}
        </figure>
      );
      i++;
      continue;
    }

    // 1. Collapsible Section Block: :::section title="..." ... :::
    if (line.trim().startsWith(':::section')) {
      const titleMatch = line.match(/title=["'](.*?)["']/);
      const title = titleMatch ? titleMatch[1] : 'بخش آموزشی';
      const sectionLines: string[] = [];
      i++;
      let depth = 1;
      while (i < lines.length) {
        if (lines[i].trim().startsWith(':::section')) {
          depth++;
        } else if (lines[i].trim() === ':::') {
          depth--;
          if (depth === 0) break;
        }
        sectionLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing :::

      elements.push(
        <LessonSectionCard
          key={`section-${keyIndex++}`}
          title={title}
          rawContent={sectionLines.join('\n')}
          ctx={ctx}
        />
      );
      continue;
    }

    // 2. Terminal Simulation Block: :::terminal title="..." ... ::: OR ```terminal
    if (line.trim().startsWith(':::terminal')) {
      const titleMatch = line.match(/title=["'](.*?)["']/);
      const title = titleMatch ? titleMatch[1] : 'نمونه ترمینال';
      const termLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(':::')) {
        termLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing :::

      elements.push(
        <InlineTerminalStep
          key={`inline-term-${keyIndex++}`}
          title={title}
          rawLines={termLines}
        />
      );
      continue;
    }

    // 3. Code Block: ```terminal title="..." OR standard ```lang ... ```
    if (line.trim().startsWith('```')) {
      const headerLine = line.trim();
      const isTerminalType = headerLine.startsWith('```terminal');

      if (isTerminalType) {
        const titleMatch = headerLine.match(/title=["'](.*?)["']/);
        const title = titleMatch ? titleMatch[1] : 'دستورات اجرایی ترمینال';
        const termLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          termLines.push(lines[i]);
          i++;
        }
        i++; // Skip closing ```
        elements.push(
          <InlineTerminalStep
            key={`inline-term-${keyIndex++}`}
            title={title}
            rawLines={termLines}
            ctx={ctx}
          />
        );
        continue;
      }

      const langMatch = headerLine.match(/^```([a-zA-Z0-9_-]*)/);
      const language = langMatch && langMatch[1] ? langMatch[1] : 'text';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing ```
      const fullCode = codeLines.join('\n');
      elements.push(
        <CodeBlock
          key={`code-${keyIndex++}`}
          code={fullCode}
          language={language}
        />
      );
      continue;
    }

    // 4. Callout Block: :::note / :::tip / :::warning / :::danger / :::important
    if (line.trim().startsWith(':::')) {
      const typeMatch = line.trim().match(/^:::([a-zA-Z]+)/);
      const calloutType = (typeMatch && typeMatch[1] ? typeMatch[1] : 'note').toLowerCase();
      const calloutLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(':::')) {
        calloutLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing :::
      elements.push(
        <CalloutBlock
          key={`callout-${keyIndex++}`}
          type={calloutType}
          content={calloutLines.join('\n')}
          ctx={ctx}
        />
      );
      continue;
    }

    // 5. Headings: # H1, ## H2, ### H3, #### H4
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingRaw = headingMatch[2].trim();
      const baseId = headingRaw
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[`*_]/g, '')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-');
      const duplicateCount = headingIdCounts.get(baseId) || 0;
      headingIdCounts.set(baseId, duplicateCount + 1);
      const id = duplicateCount === 0 ? baseId : `${baseId}-${duplicateCount}`;

      if (level === 1) {
        elements.push(
          <h1
            dir="auto"
            key={`h1-${keyIndex++}`}
            id={id}
            className="mt-2 mb-5 flex w-full items-center group scroll-mt-24 border-b border-slate-300 pb-3 pt-2 text-right text-3xl font-bold tracking-tight text-slate-950 dark:border-slate-700 dark:text-white sm:text-4xl"
          >
            <span className="flex-1 text-right">{headingRaw}</span>
            <a href={`#${id}`} className="ml-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <Hash className="w-5 h-5" />
            </a>
          </h1>
        );
      } else if (level === 2) {
        elements.push(
          <h2
            dir="auto"
            key={`h2-${keyIndex++}`}
            id={id}
            className="mt-9 mb-4 flex w-full items-center group scroll-mt-24 border-b border-slate-300/80 pb-2 pt-2 text-right text-2xl font-bold tracking-tight text-slate-950 dark:border-slate-700 dark:text-white sm:text-3xl"
          >
            <span className="flex-1 text-right">{headingRaw}</span>
            <a href={`#${id}`} className="ml-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <Hash className="w-4 h-4" />
            </a>
          </h2>
        );
      } else if (level === 3) {
        elements.push(
          <h3
            dir="auto"
            key={`h3-${keyIndex++}`}
            id={id}
            className="mt-7 mb-3 flex w-full items-center group scroll-mt-24 pt-1 text-right text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl"
          >
            <span className="flex-1 text-right">{headingRaw}</span>
            <a href={`#${id}`} className="ml-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <Hash className="w-3.5 h-3.5" />
            </a>
          </h3>
        );
      } else {
        elements.push(
          <h4
            dir="auto"
            key={`h4-${keyIndex++}`}
            id={id}
            className="mt-5 mb-2 w-full scroll-mt-24 pt-1 text-right text-lg font-semibold text-slate-900 dark:text-slate-100"
          >
            {headingRaw}
          </h4>
        );
      }
      i++;
      continue;
    }

    // 6. Tables: | Header | Header |
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(<MarkdownTable key={`table-${keyIndex++}`} rawLines={tableLines} ctx={ctx} />);
      continue;
    }

    // 7. Unordered List: - item or * item
    if (line.match(/^(\s*)[-*]\s+(.+)$/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^(\s*)[-*]\s+(.+)$/)) {
        const itemText = lines[i].replace(/^(\s*)[-*]\s+/, '');
        listItems.push(itemText);
        i++;
      }
      elements.push(
        <ul dir="auto" key={`ul-${keyIndex++}`} className="my-5 list-disc space-y-3 ps-7 text-base text-slate-800 dark:text-slate-200">
          {listItems.map((it, idx) => (
            <li key={idx} className="leading-8 marker:text-emerald-500">
              {renderInlineMarkdown(it, ctx)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 8. Ordered List: 1. item
    if (line.match(/^(\s*)\d+\.\s+(.+)$/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^(\s*)\d+\.\s+(.+)$/)) {
        const itemText = lines[i].replace(/^(\s*)\d+\.\s+/, '');
        listItems.push(itemText);
        i++;
      }
      elements.push(
        <ol dir="auto" key={`ol-${keyIndex++}`} className="my-5 list-decimal space-y-3 ps-7 text-base text-slate-800 dark:text-slate-200">
          {listItems.map((it, idx) => (
            <li key={idx} className="leading-8 marker:text-emerald-500">
              {renderInlineMarkdown(it, ctx)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 9. Blockquote: > text
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      elements.push(
        <blockquote
          dir="auto"
          key={`quote-${keyIndex++}`}
          className="my-6 rounded-e-xl border-s-4 border-emerald-500 bg-emerald-500/10 py-4 ps-5 pe-4 text-base font-medium leading-8 text-slate-800 dark:text-slate-200"
        >
          {quoteLines.map((ql, qIdx) => (
            <p dir="auto" key={qIdx}>{renderInlineMarkdown(ql, ctx)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // 10. Empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // 11. Standard Paragraph
    elements.push(
      <p dir="auto" key={`p-${keyIndex++}`} className="mb-5 text-base leading-8 text-slate-800 dark:text-slate-200">
        {renderInlineMarkdown(line, ctx)}
      </p>
    );
    i++;
  }

  return elements;
}

function resolveImageSource(source: string, imageBasePath?: string): string {
  if (/^(https?:|data:|\/)/i.test(source)) return source;
  const base = imageBasePath || '/';
  return `${base.endsWith('/') ? base : `${base}/`}${source.replace(/^\.\//, '')}`;
}

// Inline Markdown Parser: `code`, **bold**, *italic*, [link](url), <kbd>Key</kbd>
function renderInlineMarkdown(text: string, ctx: RenderContext): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Math formulas: $formula$
    const mathMatch = remaining.match(/^\$([^$]+)\$/);
    if (mathMatch) {
      parts.push(
        <span key={`math-${key++}`} className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 italic">
          {mathMatch[1]}
        </span>
      );
      remaining = remaining.slice(mathMatch[0].length);
      continue;
    }

    // Inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(
        <code
          dir="ltr"
          key={`code-${key++}`}
          className="px-1.5 py-0.5 rounded text-[13px] font-mono bg-slate-100 dark:bg-slate-800/90 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700/60"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Bold: **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(
        <strong key={`bold-${key++}`} className="font-semibold text-slate-900 dark:text-slate-100">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic: *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)([^*_]+)\1/);
    if (italicMatch) {
      parts.push(
        <em key={`italic-${key++}`} className="italic">
          {italicMatch[2]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Link: [label](url)
    const imageMatch = remaining.match(/^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)/);
    if (imageMatch) {
      const [, alt, source, title] = imageMatch;
      parts.push(
        <img
          key={`image-${key++}`}
          src={resolveImageSource(source, ctx.imageBasePath)}
          alt={alt}
          title={title}
          loading="lazy"
          className="inline-block max-w-full rounded-lg border border-slate-200 dark:border-slate-800 align-middle"
        />
      );
      remaining = remaining.slice(imageMatch[0].length);
      continue;
    }

    // Link: [label](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const label = linkMatch[1];
      const url = linkMatch[2];
      const isExternal = url.startsWith('http');
      parts.push(
        <a
          key={`link-${key++}`}
          href={url}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer noopener' : undefined}
          onClick={(e) => {
            if (!isExternal && ctx.onNavigateLesson && url.startsWith('/lessons/')) {
              e.preventDefault();
              const slug = url.replace('/lessons/', '');
              ctx.onNavigateLesson(slug);
            }
          }}
          className="text-emerald-600 dark:text-emerald-400 underline underline-offset-4 decoration-emerald-500/40 hover:decoration-emerald-500 font-medium transition-colors"
        >
          {label}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Normal text chunk up to next special character
    const nextSpecialIndex = remaining.search(/[`*_\$\[!]/);
    if (nextSpecialIndex === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecialIndex === 0) {
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      parts.push(remaining.slice(0, nextSpecialIndex));
      remaining = remaining.slice(nextSpecialIndex);
    }
  }

  return <>{parts}</>;
}

// -------------------------------------------------------------
// Static in-lesson terminal example
// -------------------------------------------------------------
interface TerminalStepItem {
  promptAndCommand: string;
  command: string;
  annotation: string;
}

const InlineTerminalStep: React.FC<{
  title: string;
  rawLines: string[];
}> = ({ title, rawLines }) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedLineIndex, setCopiedLineIndex] = useState<number | null>(null);
  const [hasHovered, setHasHovered] = useState(false);

  // Parse lines: "Router> enable | ورود به حالت Privileged EXEC"
  const steps: TerminalStepItem[] = rawLines
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const pipeIndex = line.indexOf('|');
      if (pipeIndex !== -1) {
        const cmdPart = line.substring(0, pipeIndex).trim();
        const notePart = line.substring(pipeIndex + 1).trim();

        // Extract the command portion for the per-line copy button.
        const cmdClean = cmdPart.replace(/^.*?[>#$]\s*/, '').trim();

        return {
          promptAndCommand: cmdPart,
          command: cmdClean || cmdPart,
          annotation: notePart,
        };
      }
      return {
        promptAndCommand: line,
        command: line.replace(/^.*?[>#$]\s*/, '').trim(),
        annotation: '',
      };
    });

  const handleCopyAll = () => {
    const textToCopy = steps.map((s) => s.promptAndCommand).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (cmd: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmd);
    setCopiedLineIndex(index);
    setTimeout(() => setCopiedLineIndex(null), 1500);
  };

  return (
    <div onMouseEnter={() => setHasHovered(true)} className="my-6 rounded-xl border border-slate-800 bg-[#070b13] text-slate-100 shadow-2xl overflow-hidden font-mono text-[13px]" dir="ltr">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f172a] border-b border-slate-800/90 text-xs select-none">
        {/* Mac/Linux traffic light buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 inline-block" />
        </div>

        {/* Right side title in Persian / English */}
        <div className="flex items-center gap-2 truncate px-2 font-sans text-slate-200 font-semibold text-xs text-right">
          <span className="truncate">{title}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0 font-sans">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="کپی تمامی دستورات"
          >
            {copiedAll ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">کپی شد</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>کپی</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal Steps Body */}
      <div className="p-2.5 sm:p-3 space-y-0.5 bg-[#070b13]">
        {steps.map((step, idx) => {
          const chars = step.promptAndCommand.length;
          const typeDelay = steps.slice(0, idx).reduce(
            (total, previous) => total + Math.max(previous.promptAndCommand.length * 0.035, 0.8) + 0.35,
            0,
          );
          const typeDuration = Math.max(chars * 0.035, 0.8);
          return (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2 py-0.5 rounded-lg hover:bg-slate-900/60 transition-colors group"
          >
            {/* Left: prompt stays green; the command stays white. */}
            <div className="flex items-center gap-2 font-mono font-medium tracking-tight overflow-x-auto">
              <span
                className={`select-all inline-block whitespace-nowrap text-slate-100 ${hasHovered ? 'terminal-typewriter' : ''}`}
                style={hasHovered ? {
                  '--terminal-width': `${chars}ch`,
                  animationDuration: `${typeDuration}s`,
                  animationDelay: `${typeDelay}s`,
                  animationTimingFunction: `steps(${chars}, end)`,
                } as React.CSSProperties : undefined}
              >
                {(() => {
                  const promptMatch = step.promptAndCommand.match(/^(.*?[#$>]\s*)(.*)$/);
                  if (!promptMatch) {
                    return <span className="text-slate-100">{step.promptAndCommand}</span>;
                  }
                  return (
                    <>
                      <span className="text-emerald-400">{promptMatch[1]}</span>
                      <span className="text-white">{promptMatch[2]}</span>
                    </>
                  );
                })()}
              </span>
            </div>

            {/* Right: Persian / English annotation with vertical bar | */}
            <div className="flex items-center gap-3 self-end sm:self-center shrink-0 text-xs font-sans text-slate-400 group-hover:text-slate-200 transition-colors text-right">
              {step.annotation && (
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-300 dark:text-slate-300 text-[12px] italic">
                    {step.annotation}
                  </span>
                  <span className="text-slate-600 font-mono text-sm hidden sm:inline" aria-hidden="true">
                    |
                  </span>
                </div>
              )}

              {/* Copy a single command */}
              <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleCopySingle(step.command, idx, e)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  title="کپی این دستور"
                >
                  {copiedLineIndex === idx ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>

    </div>
  );
};

// -------------------------------------------------------------
// Collapsible Lesson Section Card (Matches User Screenshot)
// -------------------------------------------------------------
const LessonSectionCard: React.FC<{
  title: string;
  rawContent: string;
  ctx: RenderContext;
}> = ({ title, rawContent, ctx }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Split lines into top description and inner blocks
  const innerElements = parseMarkdownToReact(rawContent, ctx);

  return (
    <div dir="auto" className="my-6 rounded-2xl border border-slate-800 bg-[#0d131f] text-slate-200 shadow-xl overflow-hidden">
      {/* Card Header with Blue Arrow & Pin Icon */}
      <button
        dir="auto"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-[#0d131f] hover:bg-[#111929] transition-colors border-b border-slate-800/80 text-start cursor-pointer"
      >
        <div className="text-blue-400 p-1">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>

        <div className="flex items-center gap-2.5 text-blue-400 font-bold text-base sm:text-lg">
          <Pin className="w-4 h-4 text-rose-500 fill-rose-500 rotate-45 shrink-0" />
          <span>{title}</span>
        </div>
      </button>

      {/* Card Body */}
      {isOpen && (
        <div dir="auto" className="p-4 sm:p-6 space-y-4">
          {innerElements}
        </div>
      )}
    </div>
  );
};

// Code Block with copy support
const CodeBlock: React.FC<{
  code: string;
  language: string;
}> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div dir="ltr" className="relative my-5 overflow-hidden rounded-xl border border-slate-700/80 bg-[#080d19] text-slate-200 shadow-lg shadow-slate-950/20">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/90 bg-gradient-to-r from-slate-900 to-slate-950 px-4 py-2.5 text-xs font-mono">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
          </div>
          <span className="truncate rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 uppercase tracking-wider text-[10px] font-bold text-emerald-300">{language}</span>
        </div>
        <div className="flex items-center gap-2">

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700 hover:text-white"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>کپی</span>
              </>
            )}
          </button>
        </div>
      </div>
      <pre dir="ltr" className="overflow-x-auto py-2.5 text-[13px] leading-6 font-mono selection:bg-emerald-500/30">
        {['bash', 'sh', 'shell'].includes(language.toLowerCase()) ? (
          <code className="block min-w-max">
            {code.split('\n').map((line, index) => (
                <span key={index} className="flex min-h-6 px-3">
                <span className="mr-5 w-5 shrink-0 select-none text-right text-slate-600">{index + 1}</span>
                <span className="whitespace-pre text-slate-200">{renderTerminalLine(line)}</span>
              </span>
            ))}
          </code>
        ) : (
          <code className="block px-4 text-slate-100">{code}</code>
        )}
      </pre>
    </div>
  );
};

function highlightBashLine(line: string): React.ReactNode[] {
  const tokenPattern = /(#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\$\{[^}]+\}|\$[A-Za-z_][\w]*|--?[A-Za-z][\w-]*|&&|\|\||[|><;]|\b(?:sudo|apt|apt-get|ls|cd|pwd|cat|grep|awk|sed|chmod|chown|mkdir|rm|touch|echo|curl|wget|ping|ip|ss|nmap|dig|nslookup|whoami|uname|clear|history|man|find|tar|systemctl|journalctl|ssh|scp|export|printf)\b)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(line)) !== null) {
    if (match.index > lastIndex) nodes.push(line.slice(lastIndex, match.index));
    const token = match[0];
    const color = token.startsWith('#')
      ? 'text-slate-500 italic'
      : token.startsWith('"') || token.startsWith("'")
        ? 'text-emerald-300'
        : token.startsWith('$')
          ? 'text-fuchsia-300'
          : token.startsWith('-')
            ? 'text-amber-300'
            : ['|', '>', '<', ';', '&&', '||'].includes(token)
              ? 'text-pink-300'
              : 'text-cyan-300';
    nodes.push(<span key={`${match.index}-${token}`} className={color}>{token}</span>);
    lastIndex = tokenPattern.lastIndex;
  }

  if (lastIndex < line.length) nodes.push(line.slice(lastIndex));
  return nodes;
}

function renderTerminalLine(line: string): React.ReactNode {
  const promptMatch = line.match(/^(.*?[#$>]\s)(.*)$/);
  if (!promptMatch) return highlightBashLine(line);

  return (
    <>
      <span className="text-emerald-400">{promptMatch[1]}</span>
      <span className="text-white">{promptMatch[2]}</span>
    </>
  );
}

// Callout Block Component
const CalloutBlock: React.FC<{
  type: string;
  content: string;
  ctx: RenderContext;
}> = ({ type, content, ctx }) => {
  const getStyle = () => {
    switch (type) {
      case 'tip':
        return {
          icon: <Lightbulb className="w-5 h-5 text-emerald-500 shrink-0" />,
          title: 'Tip / نکته کلیدی',
          border: 'border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-950/50 text-slate-900 dark:text-slate-100',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          title: 'Warning / هشدار',
          border: 'border-amber-500/50 bg-amber-500/10 dark:bg-amber-950/50 text-slate-900 dark:text-slate-100',
        };
      case 'danger':
        return {
          icon: <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />,
          title: 'Security Alert / هشدار امنیتی',
          border: 'border-rose-500/50 bg-rose-500/10 dark:bg-rose-950/50 text-slate-900 dark:text-slate-100',
        };
      case 'important':
      case 'note':
      default:
        return {
          icon: <Info className="w-5 h-5 text-cyan-500 shrink-0" />,
          title: 'Note / یادداشت',
          border: 'border-cyan-500/50 bg-cyan-500/10 dark:bg-cyan-950/50 text-slate-900 dark:text-slate-100',
        };
    }
  };

  const style = getStyle();

  return (
      <div dir="auto" className={`my-6 rounded-xl border p-5 sm:p-6 ${style.border}`}>
      <div className="mb-3 flex items-center gap-2 font-bold text-base">
        {style.icon}
        <span>{style.title}</span>
      </div>
      <div className="pl-7 text-base leading-8">
        {content.split('\n').map((l, i) => (
          <p dir="auto" key={i} className="mb-1 last:mb-0">
            {renderInlineMarkdown(l, ctx)}
          </p>
        ))}
      </div>
    </div>
  );
};

// Markdown Table Component
const MarkdownTable: React.FC<{ rawLines: string[]; ctx: RenderContext }> = ({ rawLines, ctx }) => {
  if (rawLines.length < 2) return null;

  const headerCells = rawLines[0]
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim());

  const bodyRows = rawLines.slice(2).map((rowLine) =>
    rowLine
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim())
  );

  return (
    <div dir="auto" className="my-7 overflow-x-auto rounded-xl border border-slate-300 shadow-md dark:border-slate-700">
      <table dir="auto" className="w-full text-start text-sm border-collapse">
        <thead className="border-b border-slate-300 bg-slate-100 font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
          <tr>
            {headerCells.map((h, i) => (
              <th key={i} className="px-4 py-3 text-start text-sm font-bold tracking-wide text-slate-700 dark:text-slate-100">
                {renderInlineMarkdown(h, ctx)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-950/70">
          {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-4 py-3 text-base text-slate-800 dark:text-slate-200">
                  {renderInlineMarkdown(cell, ctx)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
