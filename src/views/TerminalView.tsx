import React from 'react';
import { ShieldCheck, Terminal } from 'lucide-react';
import { TerminalSimulator } from '../components/terminal/TerminalSimulator';
import { COMMAND_REGISTRY } from '../lib/terminal-commands';

interface TerminalViewProps {
  initialCommand?: string;
  onClearInitialCommand?: () => void;
}

const commandGroups = [
  { id: 'core', title: 'Shell basics and files', description: 'Move around the mock workspace, inspect its files, and review the commands you have tried.' },
  { id: 'network', title: 'Networking and DNS', description: 'Inspect simulated interfaces, test reachability, resolve names, and examine HTTP responses.' },
  { id: 'recon', title: 'Reconnaissance', description: 'Practice reading sample registration data and exploring a controlled scan target.' },
  { id: 'system', title: 'Linux and system details', description: 'Review mock operating system and user details, uptime, and file permission changes.' },
] as const;

export const TerminalView: React.FC<TerminalViewProps> = ({ initialCommand, onClearInitialCommand }) => (
  <main className="mx-auto w-full max-w-7xl space-y-12 px-4 py-8 sm:px-6 sm:py-10">
    <header className="border-b border-slate-200 pb-6 dark:border-slate-800">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <Terminal className="h-4 w-4" />
        <span>INTERACTIVE LABORATORY</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Terminal Sandbox</h1>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
        Try Linux, networking, and reconnaissance commands in a simulated workspace. Use the prompt below or choose a suggested command.
      </p>
    </header>

    <section aria-label="Interactive terminal">
      <TerminalSimulator initialCommand={initialCommand} onClearInitialCommand={onClearInitialCommand} />
    </section>

    <article className="mx-auto max-w-5xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">Terminal field guide</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">Commands available in this sandbox</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          The console returns controlled sample output for each supported command. Start with <code className="font-mono text-emerald-600 dark:text-emerald-400">help</code>, then try the examples in each collection.
        </p>
      </header>

      <div className="space-y-10">
        {commandGroups.map((group) => {
          const commands = Object.values(COMMAND_REGISTRY).filter((command) => command.category === group.id);
          return (
            <section key={group.id} className="border-t border-slate-200 pt-6 dark:border-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{group.title}</h3>
              <p className="mb-5 mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">{group.description}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {commands.map((command) => (
                  <div key={command.name} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50 sm:p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <code className="font-mono text-base font-semibold text-emerald-700 dark:text-emerald-400">{command.name}</code>
                      <code className="font-mono text-xs text-slate-500 dark:text-slate-400">{command.usage}</code>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{command.summary}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <aside className="mt-10 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:p-5">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
        <p>This is a browser-only simulation. Commands use mock data and do not start operating system processes or send network traffic.</p>
      </aside>
    </article>
  </main>
);
