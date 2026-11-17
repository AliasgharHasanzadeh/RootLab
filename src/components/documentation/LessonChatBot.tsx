import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, Expand, LoaderCircle, Minimize2, Send, Sparkles, X } from 'lucide-react';
import { MarkdownRenderer } from '../../lib/markdown';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface LessonChatBotProps {
  lessonText: string;
}

const WORKER_URL = 'https://rootlab.majid-samurai2006.workers.dev/';
const welcomeMessage = 'سلام! هر سؤالی درباره‌ی این درس داری بپرس تا بر اساس محتوای همین درس راهنمایی‌ات کنم.';

export const LessonChatBot: React.FC<LessonChatBotProps> = ({ lessonText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: welcomeMessage },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const askAssistant = async (question: string, history: ChatMessage[]) => {
    const conversation = history
      .map((message) => `${message.role === 'user' ? 'دانشجو' : 'دستیار'}: ${message.text}`)
      .join('\n');
    const prompt = `تو دستیار آموزشی RootLab هستی. فقط بر اساس محتوای درس زیر پاسخ بده.
اگر سؤال ارتباطی با این درس ندارد، محترمانه بگو فقط درباره‌ی همین درس می‌توانی کمک کنی.
پاسخ‌ها را به فارسی ساده و دقیق بنویس و اگر لازم بود مثال کوتاه بزن.

محتوای درس:
---
${lessonText}
---

تاریخچه گفتگو:
${conversation}

سؤال جدید دانشجو:
${question}`;

    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: prompt }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || data?.error || `Worker request failed: ${response.status}`);
    }
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'پاسخی دریافت نشد. لطفاً دوباره تلاش کن.';
  };

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const nextMessages = [...messages, { role: 'user' as const, text: question }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    try {
      const answer = await askAssistant(question, nextMessages.slice(-8));
      setMessages((current) => [...current, { role: 'model', text: answer }]);
    } catch (error) {
      console.error('Lesson assistant error:', error);
      setMessages((current) => [...current, {
        role: 'model',
        text: 'ارتباط با Gemini برقرار نشد. کلید API را بررسی کن و دوباره تلاش کن.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50" dir="rtl">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 rounded-full bg-[#0074FD] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#0074FD]/30 transition hover:bg-[#00B8FF]"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Sparkles className="ai-float h-4 w-4" />}
        {isOpen ? 'بستن دستیار' : 'دستیار هوش مصنوعی'}
      </button>

      {isOpen && (
        <section className={`${isFullscreen ? 'fixed inset-3 z-[60] !m-0 h-auto w-auto rounded-xl' : 'mb-3 h-[min(32rem,calc(100vh-7rem))] w-[min(23rem,calc(100vw-2.5rem))] rounded-2xl'} flex flex-col overflow-hidden border border-[#0074FD]/30 bg-[#050B18] text-[#FDFDFD] shadow-2xl`}>
          <header className="flex items-center justify-between border-b border-[#0074FD]/30 bg-[#09152d] px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Bot className="h-4 w-4 text-[#00B8FF]" />
              دستیار درس
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen((fullscreen) => !fullscreen)}
                className="text-[#9ac9ff] transition hover:text-[#00B8FF]"
                title={isFullscreen ? 'خروج از حالت تمام‌صفحه' : 'تمام‌صفحه کردن'}
                aria-label={isFullscreen ? 'خروج از حالت تمام‌صفحه' : 'تمام‌صفحه کردن'}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
              </button>
            </div>
          </header>

          <>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[88%] rounded-xl px-3 py-2 text-xs leading-6 ${message.role === 'user' ? 'whitespace-pre-wrap bg-[#0055D4] text-white' : 'bg-[#10244a] text-[#FDFDFD]'}`}>
                      {message.role === 'model' ? (
                        <MarkdownRenderer content={message.text} />
                      ) : message.text}
                    </div>
                  </div>
                ))}
                {loading && <LoaderCircle className="h-4 w-4 animate-spin text-[#00B8FF]" />}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="flex gap-2 border-t border-[#0074FD]/30 bg-[#09152d] p-3">
                <input value={input} onChange={(event) => setInput(event.target.value)} disabled={loading} placeholder="سؤال خود را بنویسید..." className="min-w-0 flex-1 rounded-lg border border-[#0074FD]/40 bg-[#050B18] px-3 py-2 text-xs text-white outline-none focus:border-[#00B8FF]" />
                <button type="submit" disabled={loading || !input.trim()} className="rounded-lg bg-[#0074FD] px-3 text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#00B8FF]"><Send className="h-4 w-4" /></button>
              </form>
          </>
        </section>
      )}
    </div>
  );
};
