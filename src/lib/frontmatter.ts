import { LessonMetadata } from '../types';

interface FrontmatterResult {
  data: Partial<LessonMetadata>;
  content: string;
}

export function parseFrontmatter(rawSource: string): FrontmatterResult {
  // PowerShell and some editors save UTF-8 files with a BOM, which must not
  // prevent the opening frontmatter delimiter from matching.
  const source = rawSource.replace(/^\uFEFF/, '');
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = source.match(frontmatterRegex);

  if (!match) {
    return {
      data: {},
      content: source.trim(),
    };
  }

  const rawYaml = match[1];
  const content = match[2].trim();
  const data: Record<string, any> = {};

  const lines = rawYaml.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();

    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parse boolean
    if (value.toLowerCase() === 'true') {
      data[key] = true;
    } else if (value.toLowerCase() === 'false') {
      data[key] = false;
    }
    // Parse number
    else if (!isNaN(Number(value)) && value !== '') {
      data[key] = Number(value);
    }
    // Parse simple JSON arrays e.g. ["dns", "networking"]
    else if (value.startsWith('[') && value.endsWith(']')) {
      try {
        data[key] = JSON.parse(value.replace(/'/g, '"'));
      } catch {
        data[key] = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
      }
    } else {
      data[key] = value;
    }
  }

  return {
    data: data as Partial<LessonMetadata>,
    content,
  };
}

export function extractHeadings(content: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const headingIdCounts = new Map<string, number>();
  const lines = content.split(/\r?\n/);
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].trim();
      // Clean markdown links or formatting from heading text
      const cleanText = rawText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[`*_]/g, '');
      const baseId = cleanText
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-');
      const duplicateCount = headingIdCounts.get(baseId) || 0;
      headingIdCounts.set(baseId, duplicateCount + 1);
      const id = duplicateCount === 0 ? baseId : `${baseId}-${duplicateCount}`;

      headings.push({ id, text: cleanText, level });
    }
  }

  return headings;
}

export function calculateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}
