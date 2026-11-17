import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Bot, Expand, KeyRound, LoaderCircle, Minimize2, Send, Sparkles, Trash2, X } from 'lucide-react';
import { MarkdownRenderer } from '../../lib/markdown';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface LessonChatBotProps {
  lessonText: string;
}

const STORAGE_KEY = 'rootlab_user_gemini_api_key';
const MODEL = 'gemini-flash-lite-latest';
const welcomeMessage = 'سلام! من دستیار آموزشی RootLab هستم';

export const LessonChatBot: React.FC<LessonChatBotProps> = ({ lessonText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: welcomeMessage },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setApiKey(localStorage.getItem(STORAGE_KEY) || '');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const saveApiKey = (event: FormEvent) => {
    event.preventDefault();
    const cleanKey = keyInput.trim();
    if (!cleanKey) return;
    localStorage.setItem(STORAGE_KEY, cleanKey);
    setApiKey(cleanKey);
    setKeyInput('');
  };

  const clearApiKey = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    setMessages([{ role: 'model', text: welcomeMessage }]);
  };

  const askAssistant = async (question: string, history: ChatMessage[]) => {
    const ai = new GoogleGenAI({ apiKey });
    const conversation = history
      .map((message) => (message.role === 'user' ? 'دانشجو: ' : 'دستیار: ') + message.text)
      .join('\n');
    const prompt = 'تو دستیار آموزشی RootLab هستی. فقط بر اساس محتوای درس زیر پاسخ بده.\n' +
      'اگر سؤال خارج از موضوع درس بود، محترمانه اعلام کن که فقط درباره‌ی همین درس کمک می‌کنی.\n' +
      'پاسخ را به فارسی ساده و دقیق بنویس و در صورت نیاز مثال کوتاه بزن.\n\n' +
      'اگر پاسخ شامل اجرای دستور یا مثال ترمینال است، حتماً آن را داخل بلوک Markdown با زبان bash بنویس.\n' +
      'برای هر دستور، prompt را دقیقاً با قالب rootlab@linux:~$ شروع کن و دستور را بعد از آن بنویس.\n' +
      'خروجی ترمینال را در خط بعدی همان بلوک bash قرار بده. از نوشتن مثال ترمینال فقط به‌صورت inline یا فهرست متنی خودداری کن.\n\n' +
      'محتوای درس:\n---\n' + lessonText + '\n---\n\n' +
      'تاریخچه گفتگو:\n' + conversation + '\n\n' +
      'سؤال جدید دانشجو:\n' + question;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });
    return response.text || 'پاسخی دریافت نشد.';
  };

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || loading || !apiKey) return;

    const nextMessages = messages.concat({ role: 'user' as const, text: question });
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const answer = await askAssistant(question, nextMessages.slice(-8));
      setMessages((current) => current.concat({ role: 'model', text: answer }));
    } catch (error) {
      console.error('Lesson assistant error:', error);
      setMessages((current) => current.concat({
        role: 'model',
        text: 'ارتباط با Gemini برقرار نشد.\n\nجزئیات: ' + (error instanceof Error ? error.message : 'خطای ناشناخته'),
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50" dir="rtl">
      <button onClick={() => setIsOpen((open) => !open)} className="flex items-center gap-2 rounded-full bg-[#0074FD] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#0074FD]/30 transition hover:bg-[#00B8FF]">
        {isOpen ? <X className="h-4 w-4" /> : <Sparkles className="ai-float h-4 w-4" />}
        {isOpen ? 'بستن دستیار' : 'دستیار هوش مصنوعی'}
      </button>

      {isOpen && (
        <section className={(isFullscreen ? 'fixed inset-3 z-[60] !m-0 h-auto w-auto rounded-xl' : 'mb-3 h-[min(32rem,calc(100vh-7rem))] w-[min(23rem,calc(100vw-2.5rem))] rounded-2xl') + ' flex flex-col overflow-hidden border border-[#0074FD]/30 bg-[#050B18] text-[#FDFDFD] shadow-2xl'}>
          <header className="flex items-center justify-between border-b border-[#0074FD]/30 bg-[#09152d] px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-bold"><Bot className="h-4 w-4 text-[#00B8FF]" />دستیار هوش مصنوعی</div>
            <div className="flex items-center gap-3">
              {apiKey && <button onClick={clearApiKey} className="text-[#9ac9ff] hover:text-[#00B8FF]" title="حذف API Key"><Trash2 className="h-4 w-4" /></button>}
              <button onClick={() => setIsFullscreen((fullscreen) => !fullscreen)} className="text-[#9ac9ff] transition hover:text-[#00B8FF]" title={isFullscreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه'} aria-label={isFullscreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه'}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
              </button>
            </div>
          </header>

          {!apiKey ? (
            <form onSubmit={saveApiKey} className="flex flex-1 flex-col justify-center gap-3 p-5">
              <KeyRound className="h-6 w-6 text-[#00B8FF]" />
              <h2 className="text-sm font-bold">API Key خودت را وارد کن</h2>
              <p className="text-xs leading-6 text-[#9ac9ff]">کلید فقط در مرورگر خودت ذخیره می‌شود و به سرور پروژه ارسال نمی‌شود.</p>
              <a className="text-xs text-[#00B8FF] hover:underline" href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">دریافت API Key از Google AI Studio</a>
              <input type="password" value={keyInput} onChange={(event) => setKeyInput(event.target.value)} placeholder="AIzaSy..." className="rounded-lg border border-[#0074FD]/40 bg-[#09152d] px-3 py-2 text-sm text-white outline-none focus:border-[#00B8FF]" required />
              <button className="rounded-lg bg-[#0074FD] px-3 py-2 text-sm font-bold text-white hover:bg-[#00B8FF]">ذخیره و شروع گفتگو</button>
            </form>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <div key={message.role + '-' + index} className={'flex ' + (message.role === 'user' ? 'justify-start' : 'justify-end')}>
                    <div className={'max-w-[88%] rounded-xl px-3 py-2 text-xs leading-6 ' + (message.role === 'user' ? 'whitespace-pre-wrap bg-[#0055D4] text-white' : 'bg-[#10244a] text-[#FDFDFD]')}>
                      {message.role === 'model' ? <MarkdownRenderer content={message.text} /> : message.text}
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
          )}
        </section>
      )}
    </div>
  );
};
