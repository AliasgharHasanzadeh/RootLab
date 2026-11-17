import { SearchResult } from '../types';
import { ALL_LESSONS } from './lessons';

// Persian to English cybersecurity keyword map for cross-language search
const PERSIAN_KEYWORD_MAP: Record<string, string[]> = {
  شبکه: ['networking', 'osi', 'tcp', 'udp', 'dns', 'cidr', 'subnet'],
  لینوکس: ['linux', 'fhs', 'permission', 'suid', 'chmod', 'ssh', 'filesystem'],
  'امنیت وب': ['web-security', 'http', 'cookie', 'session', 'owasp', 'jwt', 'xss', 'sqli'],
  امنیت: ['security', 'hardening', 'owasp', 'firewall'],
  شناسایی: ['reconnaissance', 'footprinting', 'osint', 'whois', 'nmap', 'dns'],
  'ردپایابی': ['footprinting', 'reconnaissance', 'osint'],
  'پورت اسکن': ['nmap', 'port scanning', 'syn', 'scan'],
  'ان مپ': ['nmap', 'scan'],
  'ان‌مپ': ['nmap', 'scan'],
  انمپ: ['nmap', 'scan'],
  'دی ان اس': ['dns', 'bind', 'records', 'axfr'],
  دی‌ان‌اس: ['dns', 'records'],
  پرمیشن: ['permission', 'chmod', 'suid', 'sgid'],
  مجوز: ['permission', 'chmod', 'suid'],
  دسترسی: ['permission', 'access control', 'suid'],
  کوکی: ['cookie', 'session', 'samesite', 'httponly'],
  نشست: ['session', 'cookie', 'auth'],
  احراز: ['authentication', 'argon2', 'jwt', 'webauthn', 'password'],
  'احراز هویت': ['authentication', 'argon2', 'jwt', 'mfa'],
  اوآسپ: ['owasp', 'sqli', 'injection', 'vulnerabilities'],
  اوئسپ: ['owasp'],
  وایرسارک: ['wireshark', 'packet', 'pcap'],
  وایردارک: ['wireshark', 'packet'],
  شارک: ['wireshark'],
  بورپ: ['burp', 'proxy', 'repeater'],
  'برپ سوئیت': ['burp', 'proxy'],
  پراکسی: ['proxy', 'burp'],
  سابنت: ['subnet', 'cidr', 'ip'],
  هدر: ['headers', 'csp', 'hsts'],
  گواهی: ['tls', 'ssl', 'ssh'],
};

export function searchLessons(query: string): SearchResult[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery || cleanQuery.length < 2) return [];

  // Check if query matches Persian keywords
  const mappedEnglishTerms: string[] = [];
  for (const [faKeyword, enList] of Object.entries(PERSIAN_KEYWORD_MAP)) {
    if (cleanQuery.includes(faKeyword.toLowerCase()) || faKeyword.toLowerCase().includes(cleanQuery)) {
      mappedEnglishTerms.push(...enList);
    }
  }

  const results: SearchResult[] = [];
  const queryTerms = cleanQuery.split(/\s+/).filter(Boolean);
  const searchTerms = [...new Set([...queryTerms, ...mappedEnglishTerms])];

  for (const lesson of ALL_LESSONS) {
    const titleLower = lesson.title.toLowerCase();
    const descLower = lesson.description.toLowerCase();
    const catLower = lesson.category.toLowerCase();
    const contentLower = lesson.content.toLowerCase();
    const tagsLower = (lesson.tags || []).join(' ').toLowerCase();

    // 1. Direct title match (highest relevance)
    if (titleLower.includes(cleanQuery)) {
      results.push({
        slug: lesson.slug,
        title: lesson.title,
        category: lesson.category,
        description: lesson.description,
        matchType: 'title',
        excerpt: lesson.description,
      });
      continue;
    }

    // 2. Persian keyword match
    const matchedFaTerm = mappedEnglishTerms.find(
      (term) =>
        titleLower.includes(term) ||
        catLower.includes(term) ||
        tagsLower.includes(term) ||
        descLower.includes(term)
    );

    if (matchedFaTerm) {
      results.push({
        slug: lesson.slug,
        title: lesson.title,
        category: lesson.category,
        description: lesson.description,
        matchType: 'title',
        excerpt: `${lesson.category} · ${lesson.description}`,
      });
      continue;
    }

    // 3. Category match
    if (catLower.includes(cleanQuery)) {
      results.push({
        slug: lesson.slug,
        title: lesson.title,
        category: lesson.category,
        description: lesson.description,
        matchType: 'title',
        excerpt: `Found in category: ${lesson.category} · ${lesson.description}`,
      });
      continue;
    }

    // 4. Description match
    if (descLower.includes(cleanQuery)) {
      results.push({
        slug: lesson.slug,
        title: lesson.title,
        category: lesson.category,
        description: lesson.description,
        matchType: 'description',
        excerpt: highlightExcerpt(lesson.description, cleanQuery),
      });
      continue;
    }

    // 5. Body content search
    const contentIndex = contentLower.indexOf(cleanQuery);
    if (contentIndex !== -1) {
      const excerpt = extractContextExcerpt(lesson.content, contentIndex, cleanQuery.length);
      results.push({
        slug: lesson.slug,
        sectionId: findSectionId(lesson.content, contentIndex, lesson.headings),
        title: lesson.title,
        category: lesson.category,
        description: lesson.description,
        matchType: 'content',
        excerpt,
      });
      continue;
    }

    // 6. Multi-term match across expanded terms
    const anyTermFound = searchTerms.some(
      (term) =>
        titleLower.includes(term) ||
        descLower.includes(term) ||
        catLower.includes(term) ||
        tagsLower.includes(term)
    );

    if (anyTermFound) {
      results.push({
        slug: lesson.slug,
        title: lesson.title,
        category: lesson.category,
        description: lesson.description,
        matchType: 'content',
        excerpt: lesson.description,
      });
    }
  }

  return results;
}

function findSectionId(
  content: string,
  matchIndex: number,
  headings: { id: string; text: string; level: number }[]
): string | undefined {
  let headingIndex = 0;
  let activeId: string | undefined;
  let offset = 0;
  let inCodeBlock = false;

  for (const line of content.split(/\r?\n/)) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      offset += line.length + 1;
      continue;
    }
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
    if (!inCodeBlock && headingMatch && offset <= matchIndex && headings[headingIndex]) {
      activeId = headings[headingIndex].id;
    }
    if (!inCodeBlock && headingMatch) headingIndex++;
    offset += line.length + 1;
    if (offset > matchIndex) break;
  }

  return activeId;
}

function extractContextExcerpt(content: string, matchIndex: number, matchLength: number): string {
  const cleaned = content
    .replace(/[#*`_\[\]()>-]/g, ' ')
    .replace(/\s+/g, ' ');

  const targetIndex = Math.min(matchIndex, cleaned.length);
  const start = Math.max(0, targetIndex - 50);
  const end = Math.min(cleaned.length, targetIndex + matchLength + 70);

  let snippet = cleaned.substring(start, end).trim();
  if (start > 0) snippet = '...' + snippet;
  if (end < cleaned.length) snippet = snippet + '...';

  return snippet;
}

function highlightExcerpt(text: string, query: string): string {
  return text;
}
