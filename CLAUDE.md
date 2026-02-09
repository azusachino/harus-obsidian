# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Quartz v4** instance - a static site generator for publishing digital gardens and notes as websites. Quartz transforms Markdown files in the `content/` directory into a static website in the `public/` directory.

**Important**: This is NOT a standard Bun project. While Bun can be used (see `mise.toml`), the project is built on Node.js, TypeScript, and npm scripts. The Quartz CLI (`quartz/bootstrap-cli.mjs`) handles all build operations.

## Common Commands

```bash
# Development
npm run quartz build --serve    # Build and serve locally with hot reload
npm run quartz build            # Build the site (outputs to public/)
npm run docs                    # Build and serve the docs directory

# Quality
npm run check                   # TypeScript type checking + Prettier format check
npm run format                  # Auto-format code with Prettier
npm test                        # Run tests (tsx --test, Node.js native test runner)

# Mise tasks (alternative runner)
mise run build                  # Build with concurrency 8
mise run local                  # Build with concurrency 8 + serve
```

## Architecture

### Three-Stage Build Pipeline

Quartz processes content through three stages defined in `quartz/processors/`:

1. **Parse** (`parse.ts`) - Markdown files → AST using unified/remark/rehype. Transformer plugins hook into both markdown and HTML AST stages.
2. **Filter** (`filter.ts`) - Applies filter plugins to include/exclude content (e.g., `RemoveDrafts` removes files with `draft: true` frontmatter).
3. **Emit** (`emit.ts`) - Emitter plugins generate output files (HTML pages, assets, indices, etc.).

Build is orchestrated by `quartz/build.ts` with file watching via chokidar and live reload via WebSocket in serve mode.

### Plugin System

Plugins are configured in `quartz.config.ts` and come in three types, all defined in `quartz/plugins/types.ts`:

- **Transformers** (`quartz/plugins/transformers/`) - Process content during parsing. Can provide `textTransform`, `markdownPlugins`, and `htmlPlugins` hooks.
- **Filters** (`quartz/plugins/filters/`) - Implement `shouldPublish()` to include/exclude content.
- **Emitters** (`quartz/plugins/emitters/`) - Implement `emit()` (full build) and optionally `partialEmit()` (incremental rebuild) to generate output files.

New plugins must be exported from `quartz/plugins/index.ts` and added to the plugin arrays in `quartz.config.ts`.

### Component System

Components in `quartz/components/` are Preact components (`QuartzComponent` type from `quartz/components/types.ts`). They can define:

- `css` - Component-specific styles (Sass)
- `beforeDOMLoaded` / `afterDOMLoaded` - Client-side scripts

Page layout is configured in `quartz.layout.ts` with regions: `head`, `header`, `beforeBody`, `left`, `right`, `afterBody`, `footer`.

### Key Configuration Files

- `quartz.config.ts` - Main config: plugins, theme, analytics, base URL, ignore patterns
- `quartz.layout.ts` - Page layout and component placement
- `content/` - Markdown content (gitignored, synced from Obsidian vault)
- `public/` - Generated output (gitignored)

### TypeScript/JSX Notes

- JSX pragma is `preact` (`jsxImportSource: "preact"` in `tsconfig.json`)
- Strict mode with `noUnusedLocals` and `noUnusedParameters` enabled
- Client-side scripts go in `quartz/components/scripts/`
- Styles go in `quartz/components/styles/` and `quartz/styles/`

## Instance-Specific Notes

- Site title: "HarusObsidian"
- Content synced from `~/Documents/harusObsidian/` during deployment
- Deployed to `harus-mini:/data/notes/obsidian`
- Base URL: `http://harus-obsidian.harus-core.svc.cluster.local`
- Uses Plausible analytics, KaTeX for LaTeX, Obsidian-flavored markdown
- Ignore patterns: `private`, `templates`, `.obsidian`, `.trash`
