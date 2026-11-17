import { Lesson, LessonMetadata, CategoryGroup } from '../types';
import { parseFrontmatter, extractHeadings, calculateReadTime } from './frontmatter';

// Auto-discover all MDX files in src/content
const rawMdxModules = import.meta.glob('/src/content/**/*.mdx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const categoryCoverModules = import.meta.glob('/src/content/**/1.{png,jpg,jpeg,webp,svg}', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const categoryCovers = Object.fromEntries(
  Object.entries(categoryCoverModules).flatMap(([path, url]) => {
    const match = path.match(/^\/src\/content\/(.+)\/1\.(?:png|jpe?g|webp|svg)$/i);
    return match ? [[match[1], url]] : [];
  })
);

export function getCategoryCover(categorySlug: string): string | undefined {
  return categoryCovers[categorySlug];
}

// Category metadata definitions with icons and descriptions
export const CATEGORY_DEFINITIONS: Record<string, { title: string; description: string; icon: string; order: number }> = {
  networking: {
    title: 'Networking',
    description: 'Protocol architectures, packet flow, subnetting, and network layer boundaries.',
    icon: 'Network',
    order: 1,
  },
  linux: {
    title: 'Linux',
    description: 'Kernel concepts, filesystem hierarchy, permissions, and command-line forensics.',
    icon: 'Terminal',
    order: 2,
  },
  reconnaissance: {
    title: 'Reconnaissance & Footprinting',
    description: 'OSINT, domain mapping, DNS enumeration, and perimeter port scanning.',
    icon: 'Radar',
    order: 3,
  },
  'web-security': {
    title: 'Web Security',
    description: 'HTTP semantics, cookie security, modern authentication, and the OWASP Top 10.',
    icon: 'ShieldAlert',
    order: 4,
  },
  tools: {
    title: 'Security Tools',
    description: 'Practical guides for packet dissection with Wireshark and proxying with Burp Suite.',
    icon: 'Wrench',
    order: 5,
  },
};

function processAllLessons(): Lesson[] {
  const parsedLessons: Lesson[] = [];

  for (const [filePath, rawContent] of Object.entries(rawMdxModules)) {
    // Derive the folder path and slug, including nested folders.
    // Example: /src/content/linux/linux-basics/permissions.mdx
    const match = filePath.match(/^\/src\/content\/(.+)\.mdx$/);
    if (!match) continue;

    const pathParts = match[1].split('/');
    if (pathParts.length < 2) continue;
    const fileSlug = pathParts.pop()!;
    const categoryFolder = pathParts.join('/');
    const rootFolder = pathParts[0];
    const fullSlug = `${categoryFolder}/${fileSlug}`;

    const { data, content } = parseFrontmatter(rawContent);

    // Skip if marked as unpublished
    if (data.published === false) {
      continue;
    }

    const categoryDef = CATEGORY_DEFINITIONS[rootFolder];
    const categoryName = data.category || (categoryDef ? categoryDef.title : categoryFolder);
    const headings = extractHeadings(content);
    const readTime = data.readTime || calculateReadTime(content);

    const lesson: Lesson = {
      slug: fullSlug,
      categorySlug: categoryFolder,
      category: categoryName,
      title: data.title || fileSlug.replace(/-/g, ' '),
      description: data.description || 'Cybersecurity documentation note.',
      order: typeof data.order === 'number' ? data.order : 99,
      published: data.published === true || data.published === undefined,
      updatedAt: data.updatedAt || '2026-10-21',
      difficulty: data.difficulty || 'Beginner',
      readTime,
      tags: data.tags || [],
      content,
      headings,
    };

    parsedLessons.push(lesson);
  }

  // Sort lessons globally by category order then lesson order
  parsedLessons.sort((a, b) => {
    const catA = CATEGORY_DEFINITIONS[a.categorySlug.split('/')[0]]?.order ?? 99;
    const catB = CATEGORY_DEFINITIONS[b.categorySlug.split('/')[0]]?.order ?? 99;
    if (catA !== catB) return catA - catB;
    if (a.categorySlug !== b.categorySlug) return a.categorySlug.localeCompare(b.categorySlug);
    return a.order - b.order;
  });

  // Calculate prev/next navigation
  for (let i = 0; i < parsedLessons.length; i++) {
    if (i > 0) {
      parsedLessons[i].prevLesson = {
        slug: parsedLessons[i - 1].slug,
        title: parsedLessons[i - 1].title,
        category: parsedLessons[i - 1].category,
      };
    }
    if (i < parsedLessons.length - 1) {
      parsedLessons[i].nextLesson = {
        slug: parsedLessons[i + 1].slug,
        title: parsedLessons[i + 1].title,
        category: parsedLessons[i + 1].category,
      };
    }
  }

  return parsedLessons;
}

// Cached singleton list
export const ALL_LESSONS = processAllLessons();

export function getAllLessons(): Lesson[] {
  return ALL_LESSONS;
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.slug === slug);
}

export function getCategoryTrail(categorySlug: string): Array<{ id: string; title: string }> {
  const folders = categorySlug.split('/').filter(Boolean);
  return folders.map((folder, index) => ({
    id: folders.slice(0, index + 1).join('/'),
    title: CATEGORY_DEFINITIONS[folder]?.title || folderTitle(folder),
  }));
}

export function getAllCategories(): CategoryGroup[] {
  const roots: Record<string, CategoryGroup> = {};

  for (const lesson of ALL_LESSONS) {
    const pathParts = lesson.categorySlug.split('/');
    const rootId = pathParts[0];
    const rootDefinition = CATEGORY_DEFINITIONS[rootId];
    if (!roots[rootId]) {
      roots[rootId] = {
        id: rootId,
        title: rootDefinition?.title || folderTitle(rootId),
        description: rootDefinition?.description || '',
        icon: rootDefinition?.icon || 'Folder',
        order: rootDefinition?.order ?? 99,
        lessons: [],
        children: [],
      };
    }

    let parent = roots[rootId];
    for (const folder of pathParts.slice(1)) {
      parent.children ||= [];
      let child = parent.children.find((item) => item.id === `${parent.id}/${folder}`);
      if (!child) {
        child = {
          id: `${parent.id}/${folder}`,
          title: folderTitle(folder),
          description: '',
          icon: 'Folder',
          order: 99,
          lessons: [],
          children: [],
        };
        parent.children.push(child);
      }
      parent = child;
    }
    parent.lessons.push(lesson);
  }

  const sortTree = (groups: CategoryGroup[]) => {
    groups.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    groups.forEach((group) => sortTree(group.children || []));
  };
  const categories = Object.values(roots);
  sortTree(categories);
  return categories;
}

function folderTitle(folder: string): string {
  if (folder.toLowerCase() === 'youtube') return 'YouTube';
  return folder
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getRecentLessons(limit: number = 4): LessonMetadata[] {
  return [...ALL_LESSONS]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}
