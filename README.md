# Eleventy + Sveltia CMS Starter

A deliberately small Eleventy site that demonstrates a clean structure for content-driven websites:

- Eleventy 3
- EJS templates
- Markdown content
- Sveltia CMS in local-only mode
- Bun for install and scripts
- No host-specific deployment code
- No client-side JavaScript

The goal is not to be a full theme. The goal is to be a readable reference for how pages, posts, layouts, helpers, and CMS fields fit together.

## Requirements

- Bun 1.4 or newer
- A local Git repository for Sveltia's local workflow

## Quick start

```sh
bun install
bun run serve
```

Open `http://localhost:8080/`.

To edit content:

1. Open `http://localhost:8080/admin/`.
2. Choose **Work with Local Repository**.
3. Select this project folder.
4. Edit content and save. Sveltia writes the Markdown files directly.

No OAuth server or third-party account is required.

## Commands

```sh
bun run serve   # local dev server
bun run build   # production build to _site/
bun run watch   # rebuild on changes
bun run debug   # verbose Eleventy debugging
bun test        # CMS schema, build, and render tests
```

## Testing

`bun test` runs three automated checks:

- `admin/config.yml` against the official Sveltia CMS schema.
- A clean build of the real site.
- A throwaway fixture site whose content is generated from the CMS field definitions, then rendered through the real Eleventy layouts.

The render tests use randomized fixture values. They do not assert sample names such as `Jane Doe`, so normal content edits do not break the suite.

## Project structure

```text
.
├── admin/                  Sveltia CMS entry point and schema
├── assets/img/             CMS media uploads, copied as-is
├── authors/                Author Markdown and directory data
├── pages/                  Page Markdown and directory data
├── posts/                  Post Markdown and directory data
├── _data/
│   ├── helpers.js          Slug and date helpers
│   └── settings.yml        Site-wide settings
├── _includes/
│   ├── assets/css/         Inlined stylesheet
│   ├── components/         Reusable EJS fragments
│   └── layouts/            Page-level EJS layouts
├── eleventy.config.js      Collections and build configuration
├── AGENTS.md               Instructions for AI coding agents
├── docs/                   Content model and conventions
└── tests/                  CMS schema, build, and render tests
```

## How the content model works

- `pages/*.md` use `layouts/page.ejs` by default.
- `posts/*.md` use `layouts/post.ejs` and receive the internal `post` tag.
- `authors/*.md` use `layouts/author.ejs` and receive the internal `author` tag.
- `*.11tydata.js` files define the shared layout, URL, and tags for each folder.
- `pages/blog.md` uses the special `layouts/blog.ejs` layout to list posts.
- `authors.ejs` generates the author index from the `author` collection.

See `docs/content.md` for the front matter tables.

## Sveltia CMS

Configuration lives in `admin/config.yml`.
This starter intentionally uses the local workflow only. The `backend` block is still required by Sveltia's configuration format, but the placeholder repo is not used when editing a local repository.

If you later want live GitHub editing, you will need an OAuth client. Sveltia documents the options here:

- https://sveltiacms.app/en/docs/backends/github

Do not add host-specific auth or forms to this template.

## Deployment

This project has no host-specific configuration. Deploy the generated `_site/` directory to any static host.

Typical settings:

- Build command: `bun run build`
- Publish directory: `_site`

If the site is served from a subpath, update `pathPrefix` in `eleventy.config.js` and adjust root-relative links.

## Conventions

Read these before making structural changes:

- `AGENTS.md` — rules for AI agents
- `docs/content.md` — front matter and CMS mapping
- `docs/conventions.md` — EJS, HTML, CSS, and accessibility rules

## Credit

Based on the Eleventy Sveltia CMS Starter by Dan Urbanowicz, licensed under MIT. This version has been simplified for use as an AI-agent reference and removes the original hosting integration.
