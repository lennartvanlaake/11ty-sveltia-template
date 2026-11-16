# AGENTS.md

Read this before changing the project.

## Mission

This repository is a small reference implementation of how this site should be built:

- Eleventy 3
- EJS templates
- Markdown content
- Sveltia CMS in local-only mode
- Bun for install and scripts
- No host-specific deployment code

Optimize for clarity and small diffs, not feature count.

## Non-goals

- Do not add host-specific deployment code, forms, redirects, or configuration.
- Do not add Nunjucks, Liquid, Pug, Handlebars, or another template language.
- Do not add React, Vue, Svelte, or a client-side framework.
- Do not add client-side JavaScript unless the user explicitly asks for it.
- Do not add a CSS framework or a build step for CSS.
- Do not add a dependency without a clear, documented reason.
- Do not put template syntax inside Markdown content files.

## Commands

```sh
bun install
bun run serve
bun run build
bun run debug
bun test
```

The build writes to `_site/`. Never edit `_site/`; it is generated output.

## Tests

`bun test` runs the `tests/cms` suite.

- `config.test.ts` validates `admin/config.yml` against the Sveltia schema and checks paths/media settings.
- `real-site.test.ts` builds the real site and checks core output files.
- `cms-flow.test.ts` creates a temporary fixture site from the CMS field definitions, builds it with the real layouts, and checks that each entity renders.

Tests must stay content-independent. Do not assert sample names, slugs, or body text from the repository. Generate fixture values from the CMS config instead.

## Architecture

- `pages/`, `posts/`, and `authors/` contain Markdown content.
- `_includes/layouts/` contains page-level EJS layouts.
- `_includes/components/` contains reusable EJS fragments.
- `_data/` contains global data and presentation helpers.
- `*.11tydata.js` files define per-directory defaults: layout, URL, and tags.
- `eleventy.config.js` defines collections, passthrough copies, and template engines.
- `admin/` is copied as-is and contains the Sveltia CMS.
- `assets/img/` is copied as-is and is the CMS media folder.

The flow is:

1. Markdown provides content and front matter.
2. Directory data files provide shared layout, URL, and tags.
3. Eleventy builds collections.
4. EJS layouts and components render HTML.
5. Helpers format dates and slugs.

## EJS rules

Use EJS only.

```ejs
<%= value %>              escaped output
<%- value %>              raw output
<% if (condition) { %>    control flow
<% } %>
<%- include('path') %>    include another template
```

Rules:

- Use `<%= %>` by default.
- Use `<%- %>` only for `content` and includes.
- Access optional front matter through `locals`, for example `<% if (locals.summary) { %>`.
- Pass include data explicitly: `<%- include('../components/post-list', { postsList: collections.post }) %>`.
- Do not fetch data, sort collections, build slugs, or format dates inside templates. Put that logic in `_data/helpers.js`, a `*.11tydata.js` file, or `eleventy.config.js`.
- Do not introduce Nunjucks or Liquid syntax.

## Content rules

New page:

- Create `pages/<slug>.md`.
- Include `title` and `description`.
- Add `eleventyNavigation` only if it belongs in the main navigation.
- Layout and URL come from `pages/pages.11tydata.js`.
- Override `permalink` in front matter only when the page needs a special URL.

New post:

- Create `posts/<slug>.md`.
- Include `title`, `date`, `author`, and a Markdown body.
- Optional fields: `summary`, `image`, `imageAltText`.
- Layout, URL, and the internal `post` tag come from `posts/posts.11tydata.js`.

New author:

- Create `authors/<slug>.md`.
- Include `name` and a short bio body.
- The URL is derived from the display name.

When adding or renaming a front matter field, update all of these together:

1. The sample Markdown file.
2. The relevant `*.11tydata.js` file, if needed.
3. `admin/config.yml`.
4. `docs/content.md`.

## Styling rules

- Keep all CSS in `_includes/assets/css/site.css`.
- Use the existing design tokens in `:root`.
- Keep the layout responsive with CSS grid and `max-width`.
- Preserve the skip link and visible focus styles.
- Use semantic HTML: `header`, `nav`, `main`, `article`, `footer`, `time`.
- Every image needs meaningful `alt` text.
- Do not add inline styles.

## Definition of done

Before finishing a change:

- `bun run build` passes.
- `bun test` passes.
- `_site/index.html` exists.
- New content produces the expected URL.
- `_site/admin/config.yml` exists.
- CMS fields match the Markdown front matter.
- Internal links point to existing pages.
- No host-specific deployment code remains.
- No client-side JavaScript was added.
- No Nunjucks or Liquid syntax was introduced.
