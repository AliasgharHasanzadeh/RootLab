import React from 'react';
import {
  BookOpen,
  Code2,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  Network,
  Send,
  Shield,
  Sparkles,
  Terminal,
  Youtube,
} from 'lucide-react';

const copy = {
  eyebrow: "\u062f\u0631\u0628\u0627\u0631\u0647\u0654 \u0645\u0646",
  name: "\u0639\u0644\u06cc\u200c\u0627\u0635\u063a\u0631 \u062d\u0633\u0646\u200c\u0632\u0627\u062f\u0647",
  intro: "\u062f\u0627\u0646\u0634\u062c\u0648\u06cc \u0633\u0627\u0644 \u0622\u062e\u0631 \u0645\u0647\u0646\u062f\u0633\u06cc \u06a9\u0627\u0645\u067e\u06cc\u0648\u062a\u0631\u0645 \u0648 \u0628\u0647 \u062a\u0648\u0633\u0639\u0647\u0654 \u0648\u0628\u060c \u0634\u0628\u06a9\u0647 \u0648 \u0627\u0645\u0646\u06cc\u062a \u0633\u0627\u06cc\u0628\u0631\u06cc \u0639\u0644\u0627\u0642\u0647 \u062f\u0627\u0631\u0645.",
  story: "\u06cc\u0627\u062f\u06af\u06cc\u0631\u06cc \u0628\u0631\u0627\u06cc \u0645\u0646 \u0648\u0642\u062a\u06cc \u0645\u0639\u0646\u0627 \u067e\u06cc\u062f\u0627 \u0645\u06cc\u200c\u06a9\u0646\u062f \u06a9\u0647 \u0686\u06cc\u0632\u06cc \u0631\u0627 \u0628\u0633\u0627\u0632\u0645\u060c \u062f\u0631 \u0645\u062d\u06cc\u0637 \u0627\u0645\u0646 \u0627\u0645\u062a\u062d\u0627\u0646\u0634 \u06a9\u0646\u0645 \u0648 \u0628\u0639\u062f \u0622\u0646\u0686\u0647 \u0641\u0647\u0645\u06cc\u062f\u0647\u200c\u0627\u0645 \u0631\u0627 \u0633\u0627\u062f\u0647 \u0648 \u062f\u0642\u06cc\u0642 \u062b\u0628\u062a \u06a9\u0646\u0645.",
  aboutTitle: "\u0686\u0631\u0627 RootLab Docs\u061f",
  aboutText: "RootLab Docs \u062f\u0641\u062a\u0631\u0686\u0647\u0654 \u0632\u0646\u062f\u0647\u0654 \u0645\u0633\u06cc\u0631 \u06cc\u0627\u062f\u06af\u06cc\u0631\u06cc \u0645\u0646 \u0627\u0633\u062a\u061b \u062c\u0627\u06cc\u06cc \u0628\u0631\u0627\u06cc \u062c\u0645\u0639\u200c\u06a9\u0631\u062f\u0646 \u06cc\u0627\u062f\u062f\u0627\u0634\u062a\u200c\u0647\u0627\u06cc \u0641\u0646\u06cc\u060c \u0622\u0632\u0645\u0627\u06cc\u0634\u200c\u0647\u0627\u06cc \u06a9\u0648\u0686\u06a9 \u0648 \u0686\u06cc\u0632\u0647\u0627\u06cc\u06cc \u06a9\u0647 \u062f\u0631 \u0639\u0645\u0644 \u06cc\u0627\u062f \u0645\u06cc\u200c\u06af\u06cc\u0631\u0645. \u0627\u06cc\u0646 \u067e\u0631\u0648\u0698\u0647 \u0642\u0631\u0627\u0631 \u0627\u0633\u062a \u0647\u0645\u0631\u0627\u0647 \u0628\u0627 \u062a\u062c\u0631\u0628\u0647 \u0648 \u062f\u0627\u0646\u0633\u062a\u0647\u200c\u0647\u0627\u06cc\u0645 \u0631\u0634\u062f \u06a9\u0646\u062f.",
  journeyTitle: "\u0645\u0633\u06cc\u0631 \u06cc\u0627\u062f\u06af\u06cc\u0631\u06cc",
  journeyText: "\u0641\u0639\u0644\u0627\u064b \u0631\u0648\u06cc \u0644\u06cc\u0646\u0648\u06a9\u0633\u060c \u0645\u0641\u0627\u0647\u06cc\u0645 \u0634\u0628\u06a9\u0647\u060c \u062a\u0648\u0633\u0639\u0647\u0654 \u0648\u0628 \u0648 \u0627\u0628\u0632\u0627\u0631\u0647\u0627\u06cc \u0627\u0645\u0646\u06cc\u062a\u06cc \u062a\u0645\u0631\u06a9\u0632 \u062f\u0627\u0631\u0645. \u0628\u0627 \u0645\u0637\u0627\u0644\u0639\u0647 \u0634\u0631\u0648\u0639 \u0645\u06cc\u200c\u06a9\u0646\u0645\u060c \u062f\u0631 \u0645\u062d\u06cc\u0637\u200c\u0647\u0627\u06cc \u0645\u062c\u0627\u0632 \u062a\u0645\u0631\u06cc\u0646 \u0645\u06cc\u200c\u06a9\u0646\u0645 \u0648 \u0646\u062a\u06cc\u062c\u0647 \u0631\u0627 \u0645\u0633\u062a\u0646\u062f \u0645\u06cc\u200c\u06a9\u0646\u0645 \u062a\u0627 \u0628\u0639\u062f\u0627\u064b \u0628\u062a\u0648\u0627\u0646\u0645 \u0628\u0647 \u0622\u0646 \u0628\u0631\u06af\u0631\u062f\u0645 \u0648 \u0628\u0647\u062a\u0631\u0634 \u06a9\u0646\u0645.",
  invite: "\u0627\u06af\u0631 \u062a\u0648 \u0647\u0645 \u0628\u0647 \u0628\u0631\u0646\u0627\u0645\u0647\u200c\u0646\u0648\u06cc\u0633\u06cc\u060c \u0634\u0628\u06a9\u0647\u060c \u0644\u06cc\u0646\u0648\u06a9\u0633 \u06cc\u0627 \u0627\u0645\u0646\u06cc\u062a \u0639\u0644\u0627\u0642\u0647\u200c\u0645\u0646\u062f\u06cc\u060c \u062e\u0648\u0634\u062d\u0627\u0644 \u0645\u06cc\u200c\u0634\u0648\u0645 \u06cc\u0627\u062f\u062f\u0627\u0634\u062a\u200c\u0647\u0627 \u0648 \u062a\u062c\u0631\u0628\u0647\u200c\u0647\u0627\u06cc\u0645\u0627\u0646 \u0631\u0627 \u0628\u0627 \u0647\u0645 \u0628\u0647 \u0627\u0634\u062a\u0631\u0627\u06a9 \u0628\u06af\u0630\u0627\u0631\u06cc\u0645.",
  focus1Title: "\u06cc\u0627\u062f\u06af\u06cc\u0631\u06cc \u0639\u0645\u0644\u06cc",
  focus1Text: "\u0645\u0641\u0647\u0648\u0645\u200c\u0647\u0627 \u0631\u0627 \u0628\u0627 \u062a\u0645\u0631\u06cc\u0646 \u0648 \u0622\u0632\u0645\u0627\u06cc\u0634 \u0628\u0647\u062a\u0631 \u0645\u06cc\u200c\u0641\u0647\u0645\u0645.",
  focus2Title: "\u0645\u0633\u062a\u0646\u062f\u0633\u0627\u0632\u06cc",
  focus2Text: "\u06cc\u0627\u062f\u062f\u0627\u0634\u062a\u200c\u0647\u0627 \u06a9\u0645\u06a9 \u0645\u06cc\u200c\u06a9\u0646\u0646\u062f \u0645\u0633\u06cc\u0631 \u0648 \u062a\u0635\u0645\u06cc\u0645\u200c\u0647\u0627 \u0631\u0648\u0634\u0646 \u0628\u0645\u0627\u0646\u0646\u062f.",
  focus3Title: "\u06cc\u0627\u062f\u06af\u06cc\u0631\u06cc \u062f\u0631 \u062c\u0645\u0639",
  focus3Text: "\u0628\u0647\u200c\u0627\u0634\u062a\u0631\u0627\u06a9\u200c\u06af\u0630\u0627\u0634\u062a\u0646 \u0622\u0645\u0648\u062e\u062a\u0647\u200c\u0647\u0627 \u0628\u0647 \u0631\u0634\u062f \u0647\u0645\u0647 \u06a9\u0645\u06a9 \u0645\u06cc\u200c\u06a9\u0646\u062f.",
  contactTitle: "\u0631\u0627\u0647\u200c\u0647\u0627\u06cc \u0627\u0631\u062a\u0628\u0627\u0637\u06cc",
};

const focusAreas = [
  { icon: Code2, title: copy.focus1Title, text: copy.focus1Text },
  { icon: BookOpen, title: copy.focus2Title, text: copy.focus2Text },
  { icon: Sparkles, title: copy.focus3Title, text: copy.focus3Text },
];

const socialLinks = [
  { name: 'YouTube', subtitle: 'Video tutorials', description: 'Practical walkthroughs and security notes.', url: 'https://youtube.com', icon: Youtube, color: 'rose' },
  { name: 'LinkedIn', subtitle: 'Professional profile', description: 'Connect around technology and security.', url: 'https://linkedin.com', icon: Linkedin, color: 'sky' },
  { name: 'GitHub', subtitle: 'Code and projects', description: 'Repositories, experiments, and learning projects.', url: 'https://github.com', icon: Github, color: 'emerald' },
  { name: 'Telegram', subtitle: 'Notes and updates', description: 'Short technical notes and useful links.', url: 'https://t.me', icon: Send, color: 'blue' },
  { name: 'Email', subtitle: 'Direct contact', description: 'Reach out about feedback or collaboration.', url: 'mailto:majid.samurai2006@gmail.com', icon: Mail, color: 'amber' },
  { name: 'RootLab', subtitle: 'Main platform', description: 'Explore the wider RootLab ecosystem.', url: 'https://rootlab.ir', icon: Globe, color: 'cyan' },
];

const accentClasses: Record<string, string> = {
  rose: 'bg-rose-500/10 text-rose-500 group-hover:border-rose-500/50',
  sky: 'bg-sky-500/10 text-sky-500 group-hover:border-sky-500/50',
  emerald: 'bg-emerald-500/10 text-emerald-500 group-hover:border-emerald-500/50',
  blue: 'bg-blue-500/10 text-blue-500 group-hover:border-blue-500/50',
  amber: 'bg-amber-500/10 text-amber-500 group-hover:border-amber-500/50',
  cyan: 'bg-cyan-500/10 text-cyan-500 group-hover:border-cyan-500/50',
};

export const AboutView: React.FC = () => (
  <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-14">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
      <Shield className="w-4 h-4" />
      <span>RootLab Docs / About</span>
    </div>

    <article dir="rtl" className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-2xl shadow-slate-950/10">
      <div className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 h-px w-2/3 bg-gradient-to-l from-transparent via-emerald-400/40 to-transparent" />
      <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
        <div className="flex flex-col justify-center space-y-7 lg:col-span-7">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
            <Sparkles className="h-4 w-4" />
            <span>{copy.eyebrow}</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{copy.name}</h1>
            <p className="max-w-2xl text-lg leading-9 text-slate-300 sm:text-xl">{copy.intro}</p>
          </div>
          <p className="max-w-2xl border-r-2 border-emerald-400/70 pr-5 text-base leading-8 text-slate-400 sm:text-lg">
            {copy.story}
          </p>
        </div>

        <aside className="relative flex flex-col justify-center rounded-3xl border border-white/10 bg-slate-950/55 p-5 shadow-inner shadow-white/[0.03] backdrop-blur-sm sm:p-7 lg:col-span-5">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4" dir="ltr">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <Code2 className="h-4 w-4 text-emerald-400" />
              <span>~/rootlab/profile.md</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.7)]" />
          </div>
          <div className="space-y-5" dir="ltr">
            <div className="font-mono text-sm text-slate-500"><span className="text-emerald-400">$</span> cat current-focus</div>
            {[
              { number: '01', title: 'Linux & systems', icon: Terminal },
              { number: '02', title: 'Networks & protocols', icon: Network },
              { number: '03', title: 'Web & security', icon: Shield },
            ].map(({ number, title, icon: Icon }) => (
              <div key={number} className="flex items-center gap-4 border-b border-white/[0.07] pb-4 last:border-0 last:pb-0">
                <span className="font-mono text-xs text-emerald-400/70">{number}</span>
                <Icon className="h-4 w-4 text-emerald-300" />
                <span className="text-sm font-medium text-slate-200 sm:text-base">{title}</span>
              </div>
            ))}
          </div>
          <div className="mt-7 flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3 text-xs text-slate-400" dir="ltr">
            <span>Learning by building and documenting</span>
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
        </aside>
      </div>
    </article>

    <section className="grid gap-6 border-y border-slate-200 py-7 dark:border-slate-800 md:grid-cols-3 md:gap-8" dir="rtl" aria-label="Learning principles">
      {focusAreas.map(({ icon: Icon, title, text }, index) => (
        <div key={title} className="flex items-start gap-4">
          <span className="font-mono text-xs text-emerald-500/80">0{index + 1}</span>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-emerald-500" />
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            </div>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">{text}</p>
          </div>
        </div>
      ))}
    </section>

    <section className="grid gap-8 lg:grid-cols-2 lg:gap-12" dir="rtl">
      <article className="space-y-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-emerald-500" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{copy.aboutTitle}</h2>
        </div>
        <p className="text-base leading-8 text-slate-600 dark:text-slate-400">{copy.aboutText}</p>
      </article>
      <article className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800 lg:border-r lg:border-t-0 lg:pr-10 lg:pt-0">
        <div className="flex items-center gap-3">
          <Network className="h-5 w-5 text-cyan-500" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{copy.journeyTitle}</h2>
        </div>
        <p className="text-base leading-8 text-slate-600 dark:text-slate-400">{copy.journeyText}</p>
      </article>
    </section>

    <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8" dir="rtl">
      <p className="text-lg leading-8 text-slate-700 dark:text-slate-300">{copy.invite}</p>
    </section>

    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-800" dir="rtl">
        <Globe className="h-5 w-5 text-emerald-500" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{copy.contactTitle}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {socialLinks.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
              className={`group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/50 ${accentClasses[item.color]}`}
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentClasses[item.color].split(' ')[0]} ${accentClasses[item.color].split(' ')[1]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.name}</h3>
              <p className="mt-1 text-xs font-medium text-slate-400">{item.subtitle}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>
            </a>
          );
        })}
      </div>
    </section>
  </main>
);

