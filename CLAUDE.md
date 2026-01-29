# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Quartz v4** instance - a static site generator for publishing digital gardens and notes as websites. Quartz transforms Markdown files in the `content/` directory into a static website in the `public/` directory.

**Important**: This is NOT a standard Bun project. While Bun can be used, the project is built on Node.js, TypeScript, and npm scripts. The Quartz CLI (`quartz/bootstrap-cli.mjs`) handles all build operations.

## Common Commands

### Development

- `npm run quartz build --serve` - Build and serve the site locally with hot reload
- `npm run docs` - Build and serve the docs directory
- `npm run quartz build` - Build the site (outputs to `public/`)

### Quality Checks

- `npm run check` - Run TypeScript type checking and Prettier format checking
- `npm run format` - Auto-format code with Prettier
- `npm test` - Run tests using tsx test runner

### Mise Tasks (if using mise)

- `mise run build` - Build with concurrency 8
- `mise run deploy` - Copy content from Obsidian vault, build, and rsync to remote server
- `mise run prod` - Build and copy to production directory

### Quartz CLI Commands

The Quartz CLI is the main interface. Run via `npm run quartz <command>`:

- `quartz create` - Initialize a new Quartz project
- `quartz build` - Build the site
  - `--serve` - Serve locally with hot reload
  - `--concurrency N` - Set build concurrency
- `quartz update` - Update Quartz to the latest version
- `quartz sync` - Sync to/from GitHub
- `quartz restore` - Restore content from cache

## Architecture

### Three-Stage Build Pipeline

Quartz processes content through three stages defined in `quartz/processors/`:

1. **Parse** (`parse.ts`) - Transforms Markdown files to Abstract Syntax Trees (AST)
   - Uses unified/remark for Markdown → MD AST
   - Uses rehype for MD AST → HTML AST
   - Applies transformer plugins at both stages

2. **Filter** (`filter.ts`) - Filters content based on filter plugins
   - Example: `RemoveDrafts` removes files with `draft: true` frontmatter

3. **Emit** (`emit.ts`) - Generates output files
   - Emitter plugins generate HTML pages, assets, indices, etc.

### Plugin System

Plugins are configured in `quartz.config.ts` and come in three types:

**Transformers** (`quartz/plugins/transformers/`):

- Process and transform content during parsing
- Examples: `FrontMatter`, `ObsidianFlavoredMarkdown`, `SyntaxHighlighting`, `Latex`
- Can provide both markdown and HTML plugins to the unified pipeline

**Filters** (`quartz/plugins/filters/`):

- Determine which content to include/exclude
- Example: `RemoveDrafts`

**Emitters** (`quartz/plugins/emitters/`):

- Generate output files
- Examples: `ContentPage` (individual pages), `FolderPage` (folder indices), `TagPage` (tag pages), `Assets`, `ContentIndex` (search index, sitemap, RSS)

### Component System

UI components in `quartz/components/` are Preact components that render parts of the page:

**Page Components**: Defined in `quartz.layout.ts`

- `sharedPageComponents` - Shared across all pages (head, header, footer)
- `defaultContentPageLayout` - Layout for single note pages
- `defaultListPageLayout` - Layout for list pages (tags, folders)

Components can be placed in `beforeBody`, `left`, `right`, or `afterBody` regions.

**Key Components**:

- `Head` - HTML head (meta tags, scripts, styles)
- `ArticleTitle`, `ContentMeta`, `TagList` - Content metadata
- `Explorer` - File tree navigation
- `Search` - Full-text search
- `Graph` - Interactive graph view
- `TableOfContents` - Page TOC
- `Backlinks` - Bidirectional links

### Configuration Files

- `quartz.config.ts` - Main configuration (plugins, theme, analytics, base URL)
- `quartz.layout.ts` - Page layout and component placement
- `content/` - Your Markdown content (maps to Obsidian vault)
- `public/` - Generated static site (gitignored, build output)
- `quartz/` - Quartz source code (typically not modified)

### Build System

- Build orchestrated by `quartz/build.ts`
- Uses `chokidar` for file watching in serve mode
- WebSocket server for live reload on port `wsPort`
- Parallel processing with `workerpool` for performance
- ESBuild for bundling JavaScript/CSS

## Development Guidelines

### Working with Content

- Content goes in `content/` directory (gitignored in this repo)
- Markdown files can use Obsidian-flavored markdown (wikilinks, embeds, callouts)
- Frontmatter controls metadata (title, tags, date, draft status)
- Files/folders matching `ignorePatterns` in config are excluded

### Modifying Plugins

- Create new transformers in `quartz/plugins/transformers/`
- Create new emitters in `quartz/plugins/emitters/`
- Export from `quartz/plugins/index.ts`
- Add to plugin arrays in `quartz.config.ts`

### Modifying Components

- Components use Preact with TypeScript
- JSX pragma is `preact` (see `tsconfig.json`)
- Client-side scripts in `quartz/components/scripts/`
- Styles in `quartz/components/styles/` and `quartz/styles/`

### Testing

- Tests use tsx test runner (Node.js native test runner)
- Test files: `**/*.test.ts`
- Run with `npm test`
- Examples in `quartz/util/path.test.ts` and `quartz/util/fileTrie.test.ts`

## Technical Stack

- **Language**: TypeScript with strict mode
- **Runtime**: Node.js 22+ (see `engines` in package.json)
- **UI Framework**: Preact (React-compatible but smaller)
- **Markdown Processing**: unified, remark, rehype
- **Bundler**: ESBuild
- **CSS**: Sass (via esbuild-sass-plugin)
- **Build Tools**: chokidar (watching), workerpool (parallelization)
- **Client Features**: D3 (graphs), FlexSearch (search), micromorph (SPA navigation)

## Notes

- The `mise.toml` file defines custom deployment workflows specific to this instance
- Content is synced from `~/Documents/harusObsidian/` in the deploy task
- The site is deployed to a remote server at `harus-mini:/data/notes/obsidian`
- This instance uses a custom base URL: `http://harus-obsidian.harus-core.svc.cluster.local`
