# Admonition Support

This Quartz instance now supports both traditional Obsidian callouts and code-block style admonitions.

## Traditional Blockquote Callouts

The standard Obsidian callout syntax using blockquotes:

```markdown
> [!note]
> This is a note callout.

> [!warning] Custom Title
> This is a warning with a custom title.

> [!tip]+ Expandable
> This callout starts expanded.

> [!danger]- Collapsed
> This callout starts collapsed.
```

## Code-Block Style Admonitions

NEW: You can now use code-block style admonitions (similar to the Obsidian Admonition plugin):

### Basic Syntax

````markdown
```ad-note
This is a simple note without a custom title.
```
````

### With Custom Title

````markdown
```ad-warning
title: Custom Warning Title
This is the content of the warning.
```
````

### Collapsible (Starts Open)

````markdown
```ad-tip
title: Pro Tip
collapse: open
This tip can be collapsed by clicking the title.
```
````

### Collapsible (Starts Closed)

````markdown
```ad-danger
title: Important Warning
collapse: closed
This warning starts collapsed.
```
````

## Supported Types

Both syntaxes support the same callout types:

- `note` - General notes and information
- `abstract` / `summary` / `tldr` - Summaries and abstracts
- `info` - Informational content
- `todo` - Todo items
- `tip` / `hint` / `important` - Tips and hints
- `success` / `check` / `done` - Success messages
- `question` / `help` / `faq` - Questions
- `warning` / `caution` / `attention` - Warnings
- `failure` / `fail` / `missing` - Failures
- `danger` / `error` - Dangerous or error content
- `bug` - Bug reports
- `example` - Examples
- `quote` / `cite` - Quotations

## Metadata Options (Code-Block Style Only)

The code-block style supports these metadata options at the start of the content:

- `title: Your Title` - Custom title for the admonition
- `collapse: open` - Make the admonition collapsible, starting expanded
- `collapse: closed` - Make the admonition collapsible, starting collapsed

Metadata must be on separate lines before the main content.

## Configuration

The admonition feature is enabled by default. To disable it, modify `quartz.config.ts`:

```typescript
Plugin.ObsidianFlavoredMarkdown({
  enableInHtmlEmbed: false,
  admonitions: false  // Add this to disable code-block admonitions
})
```

## Implementation Details

- Code-block admonitions are transformed into the same HTML structure as blockquote callouts
- They share the same CSS styling and JavaScript behavior
- Both syntaxes can be used interchangeably in the same document
- The feature uses the existing callout infrastructure, so all colors, icons, and behaviors are consistent
