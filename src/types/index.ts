export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LessonMetadata {
  slug: string;
  categorySlug: string;
  category: string;
  title: string;
  description: string;
  order: number;
  published: boolean;
  updatedAt: string;
  difficulty?: Difficulty;
  readTime?: string;
  tags?: string[];
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export interface Lesson extends LessonMetadata {
  content: string;
  headings: HeadingItem[];
  prevLesson?: { slug: string; title: string; category: string } | null;
  nextLesson?: { slug: string; title: string; category: string } | null;
}

export interface CategoryGroup {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  lessons: LessonMetadata[];
  children?: CategoryGroup[];
}

export interface SearchResult {
  slug: string;
  sectionId?: string;
  title: string;
  category: string;
  description: string;
  matchType: 'title' | 'description' | 'content';
  excerpt: string;
}

export interface TerminalOutputLine {
  id: string;
  type: 'prompt' | 'stdout' | 'stderr' | 'info' | 'success' | 'table';
  text: string;
  rawHtml?: boolean;
}

export interface TerminalCommandDef {
  name: string;
  summary: string;
  usage: string;
  category: 'core' | 'network' | 'recon' | 'system';
  execute: (args: string[], fullCommand: string) => TerminalOutputLine[];
}
