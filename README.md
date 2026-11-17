# rootLab-theDoc — Cybersecurity Learning & Documentation Platform

rootLab-theDoc is a modern, responsive cybersecurity notebook, practical documentation system, and interactive terminal laboratory built as a key documentation arm of the **rootLab** ecosystem.

---

## 🚀 Key Features

- **Interactive In-Lesson Terminal Simulation**:
  - Direct simulated terminal command blocks inside lessons with live execution preview, explanations, and copy functionality (e.g. Cisco router config and Nmap scans).
- **Automatic MDX / Markdown Content Engine**:
  - Automatically discovers all `.mdx` lesson files.
  - Frontmatter parser extracting title, description, category, difficulty, read time, and order.
  - Generates navigation sidebar, category groupings, and linear previous/next lesson routes dynamically.
  - Automatic Table of Contents (TOC) extraction for H1, H2, and H3 headings with active scroll tracking.
  - Rich callout blocks (`:::note`, `:::tip`, `:::warning`, `:::danger`, `:::important`, `:::section`, `:::terminal`).
  - Code blocks with one-click copy and "Simulate in Terminal" button.
- **Interactive Safe Terminal Simulator**:
  - Realistic Linux terminal prompt: `student@rootlab:~$`.
  - In-browser simulated execution of `nmap`, `curl -I`, `dig`, `nslookup`, `ip addr`, `ip route`, `ping`, `cat`, `ls -la`, `whoami`, `chmod`, `history`, and `help`.
  - Arrow Up / Arrow Down command history.
  - Tab auto-completion for supported commands.
  - Zero server-side or OS command execution; completely sandboxed and safe.
- **Instant Client-Side Search (Ctrl+K / Cmd+K)**:
  - Real-time search indexing titles, categories, descriptions, and full MDX body content.
  - Contextual excerpts and keyboard navigation (Arrow Up, Down, Enter, Esc).
- **Study Progress & Personal Notebook Tools**:
  - "Mark as Completed" with confetti celebrations and category completion tallies.
  - Bookmarks drawer for saving reference notes.
  - Reading progress indicator.
- **Design & Typography**:
  - Dark/Light mode toggle with persistence in `localStorage` and system preference detection.
  - Cybersecurity dashboard aesthetics: charcoal surfaces, deep navy canvas, and restrained emerald/cyan accents.
  - Typography using Plus Jakarta Sans, JetBrains Mono, and Vazirmatn for English and Persian technical clarity.

---

## 📂 Project Structure

```text
├── content/ (or src/content/)
│   ├── networking/
│   │   ├── osi-model.mdx
│   │   ├── tcp-udp.mdx
│   │   ├── dns-records.mdx
│   │   └── subnets-cidr.mdx
│   ├── linux/
│   │   ├── filesystem-navigation.mdx
│   │   ├── file-permissions.mdx
│   │   └── ssh-fundamentals.mdx
│   ├── reconnaissance/
│   │   ├── footprinting-intro.mdx
│   │   ├── whois-lookup.mdx
│   │   ├── dns-enumeration.mdx
│   │   └── nmap-basics.mdx
│   ├── web-security/
│   │   ├── http-fundamentals.mdx
│   │   ├── cookies-and-sessions.mdx
│   │   ├── authentication-basics.mdx
│   │   └── owasp-top-10.mdx
│   └── tools/
│       ├── wireshark-fundamentals.mdx
│       └── burp-suite-intro.mdx
├── src/
│   ├── components/
│   │   ├── common/             # BookmarksDrawer, ShortcutsModal
│   │   ├── documentation/      # Sidebar, LessonContent, TableOfContents
│   │   ├── layout/             # Header (3-zone contract), Footer
│   │   ├── search/             # SearchDialog (Cmd+K)
│   │   └── terminal/           # TerminalSimulator
│   ├── context/
│   │   ├── LearningContext.tsx # Completed lessons, bookmarks, progress
│   │   └── ThemeContext.tsx    # Light/Dark/System theme switcher
│   ├── lib/
│   │   ├── frontmatter.ts      # YAML frontmatter & headings parser
│   │   ├── lessons.ts          # Automatic content discovery & routing
│   │   ├── markdown.tsx        # MDX/Markdown custom component renderer
│   │   ├── search.ts           # Client-side full-text search engine
│   │   └── terminal-commands.ts# Safe terminal command registry
│   ├── types/                  # Typed interfaces
│   ├── views/                  # HomeView, LessonsView, TerminalView, AboutView
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
└── package.json
```

---

## ✍️ How to Add a New Lesson

To add a new lesson, create a new `.mdx` file inside the appropriate category folder under `src/content/`. For example, to add an Active Directory lesson:

Create `src/content/reconnaissance/active-directory-recon.mdx`:

```mdx
---
title: "Active Directory Reconnaissance"
description: "Enumerate domain controllers, LDAP queries, and BloodHound mapping."
category: "Reconnaissance & Footprinting"
order: 5
published: true
updatedAt: "2026-10-21"
difficulty: "Intermediate"
readTime: "8 min read"
tags: ["active-directory", "ldap", "bloodhound", "kerberos"]
---

# Active Directory Reconnaissance

Lesson content goes here.

## Overview of Kerberos Authentication

Write your technical explanation...

:::note
Use callouts with :::note, :::tip, :::warning, or :::danger.
:::

```bash
# Code blocks can be run in the terminal or copied
nmap -p 88,389,445 192.168.1.2
```
```

**That is all!**
- The lesson is automatically detected via `import.meta.glob`.
- Its frontmatter is parsed and converted to typed metadata.
- It appears in the sidebar under its category.
- Its headings (H1, H2, H3) automatically populate the Table of Contents.
- It is indexed in the global search dialog (`Ctrl+K`).
- Linear next/previous lesson navigation links update automatically.

---

## 🛠️ Installation & Local Development

Run the following commands in the project directory:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Terminal Command Registry & Security

The CyberVault terminal simulator is 100% client-side and secure:
- **No real subprocess execution**: Inputs are parsed safely through a dictionary lookup in `src/lib/terminal-commands.ts`.
- **Predefined educational responses**: Realistic outputs for tools like `nmap`, `dig`, `curl`, and `ip` allow learners to inspect flags, headers, and port states without making network requests.
- **Tab Completion**: Hit `Tab` while typing any command to view matching commands or autocomplete.
- **Command History**: Navigate executed commands with `Arrow Up` and `Arrow Down`.

---

## ⚖️ Ethics & Responsible Disclosure

All documentation and simulated exercises are intended solely for authorized security evaluations, defensive engineering, and educational research. Always acquire explicit written permission before assessing any external network or application.
