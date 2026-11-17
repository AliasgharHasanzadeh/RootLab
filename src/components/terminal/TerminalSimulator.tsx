import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, RotateCcw, Trash2, Terminal as TerminalIcon, ShieldCheck } from 'lucide-react';
import { COMMAND_REGISTRY, SAMPLE_PROMPTS, executeCommandString } from '../../lib/terminal-commands';
import { TerminalOutputLine } from '../../types';

interface TerminalSimulatorProps {
  initialCommand?: string;
  onClearInitialCommand?: () => void;
  compact?: boolean;
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({ initialCommand, onClearInitialCommand, compact = false }) => {
  const [history, setHistory] = useState<TerminalOutputLine[]>([
    { id: 'init-1', type: 'info', text: 'rootLab-theDoc Linux Terminal Environment [v2.4-sandbox]' },
    { id: 'init-2', type: 'stdout', text: 'Type "help" for a list of supported diagnostic, network, and recon commands.' },
    { id: 'init-3', type: 'stdout', text: 'Practice running: "ls -la", "cat notes.txt", "ip addr", "ping example.com", or "nmap -sV 192.168.1.1".' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRunCommand = (rawCommand: string) => {
    const command = rawCommand.trim();
    if (!command) return;
    if (command.toLowerCase() === 'clear') {
      setHistory([]);
      setInputVal('');
      setHistoryIndex(-1);
      return;
    }
    const prompt: TerminalOutputLine = { id: `prompt-${Date.now()}`, type: 'prompt', text: `student@rootlab:~$ ${command}` };
    setHistory((previous) => [...previous, prompt, ...executeCommandString(command)]);
    setCommandHistory((previous) => [...previous, command]);
    setHistoryIndex(-1);
    setInputVal('');
  };

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [history]);

  useEffect(() => {
    if (initialCommand) {
      handleRunCommand(initialCommand);
      onClearInitialCommand?.();
    }
  }, [initialCommand]);

  const resetSession = () => {
    setHistory([
      { id: `reset-${Date.now()}`, type: 'info', text: 'Terminal session reset to initial laboratory state.' },
      { id: `reset-help-${Date.now()}`, type: 'stdout', text: 'Type "help" for a list of supported commands.' },
    ]);
    setCommandHistory([]);
    setHistoryIndex(-1);
    setInputVal('');
  };

  const copyBuffer = async () => {
    await navigator.clipboard.writeText(history.map((entry) => entry.text).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 font-mono text-slate-200 shadow-2xl">
      <div className={`flex items-center justify-between gap-2 border-b border-slate-800 bg-slate-900 ${compact ? 'px-3 py-2' : 'px-4 py-2.5'} text-xs`}>
        <div className="flex min-w-0 items-center gap-2">
          <div className="mr-1 flex shrink-0 items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-rose-500/80" /><span className="h-3 w-3 rounded-full bg-amber-500/80" /><span className="h-3 w-3 rounded-full bg-emerald-500/80" /></div>
          <TerminalIcon className="h-4 w-4 shrink-0 text-emerald-400" />
          <span className="truncate font-semibold text-slate-300">student@rootlab: ~/workspace</span>
        </div>
        {!compact && <div className="flex shrink-0 items-center gap-2">
          <button onClick={copyBuffer} className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-300 hover:bg-slate-700">{copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}<span>{copied ? 'Copied' : 'Copy'}</span></button>
          <button onClick={() => setHistory([])} className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-300 hover:bg-slate-700"><Trash2 className="h-3.5 w-3.5" /><span>Clear</span></button>
          <button onClick={resetSession} className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-300 hover:bg-slate-700"><RotateCcw className="h-3.5 w-3.5" /><span>Reset</span></button>
        </div>}
      </div>

      <div className={`flex items-center gap-2 overflow-x-auto border-b border-slate-800/80 bg-slate-900/50 px-3 text-xs ${compact ? 'py-1.5' : 'py-2'}`}>
        <span className="whitespace-nowrap text-[11px] text-slate-400">Try command:</span>
        <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
          {(compact ? SAMPLE_PROMPTS.slice(0, 3) : SAMPLE_PROMPTS).map((prompt) => <button key={prompt} onClick={() => handleRunCommand(prompt)} className="rounded border border-slate-700/60 bg-slate-800/80 px-2 py-0.5 text-slate-300 transition-colors hover:border-emerald-600/50 hover:bg-emerald-950/70 hover:text-emerald-300">{prompt}</button>)}
        </div>
      </div>

      <div ref={outputRef} className={`space-y-1.5 overflow-y-auto p-4 text-sm leading-relaxed ${compact ? 'h-[280px] sm:h-[300px]' : 'h-[420px] sm:h-[480px]'}`} onClick={() => inputRef.current?.focus()}>
        {history.map((entry) => <div key={entry.id} className={entry.type === 'prompt' ? 'pt-2 font-semibold text-emerald-300' : entry.type === 'stderr' ? 'text-rose-400' : entry.type === 'success' ? 'text-emerald-400' : entry.type === 'info' ? 'text-cyan-300' : 'whitespace-pre-wrap text-slate-200'}>{entry.text}</div>)}
        <form className="flex min-w-0 items-center pt-2" onSubmit={(event) => { event.preventDefault(); handleRunCommand(inputVal); }}>
          <span className="shrink-0 font-semibold text-emerald-400">student@rootlab</span><span className="shrink-0 text-slate-400">:</span><span className="shrink-0 text-cyan-400">~/workspace</span><span className="mr-2 shrink-0 text-slate-400">$</span>
          <input ref={inputRef} value={inputVal} onChange={(event) => setInputVal(event.target.value)} onKeyDown={(event) => {
            if (event.key === 'ArrowUp' && commandHistory.length) {
              event.preventDefault();
              const index = historyIndex < 0 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
              setHistoryIndex(index); setInputVal(commandHistory[index]);
            } else if (event.key === 'ArrowDown' && historyIndex >= 0) {
              event.preventDefault();
              const index = Math.min(commandHistory.length, historyIndex + 1);
              setHistoryIndex(index >= commandHistory.length ? -1 : index);
              setInputVal(index >= commandHistory.length ? '' : commandHistory[index]);
            } else if (event.key === 'Tab') {
              event.preventDefault();
              const matches = Object.keys(COMMAND_REGISTRY).filter((command) => command.startsWith(inputVal.trim().toLowerCase()));
              if (matches.length === 1) setInputVal(`${matches[0]} `);
            }
          }} autoComplete="off" spellCheck={false} autoFocus={!compact} className="min-w-0 flex-1 bg-transparent text-[13px] text-white caret-emerald-400 focus:outline-none" />
        </form>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-800/80 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-300">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
        <span>{compact ? 'Simulated sandbox · commands run in-browser' : 'Browser-only simulation with mock data; no external packets are sent.'}</span>
      </div>
    </div>
  );
};
