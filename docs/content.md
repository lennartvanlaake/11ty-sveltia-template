# Content model

Content is plain Markdown with YAML front matter. Template syntax is intentionally disabled in Markdown, so content files should never contain TSX.

## Pages

Files: `pages/*.md`

Directory defaults: `pages/pages.11tydata.js`

| Field | Required | Purpose |
|---|---|---|
| `title` | Yes | Visible page heading and default meta title |
| `description` | Recommended | Meta description |
| `eleventyNavigation` | No | Adds the page to the main navigation |
| `permalink` | No | Overrides the default `/<filename>/` URL |

Example:

```yaml
---
title: About
description: What this site is for.
eleventyNavigation:
  key: about
  title: About
  order: 2
---
```

## Posts

Files: `posts/*.md`

Directory defaults: `posts/posts.11tydata.js`

| Field | Required | Purpose |
|---|---|---|
| `title` | Yes | Post heading |
| `date` | Yes | Publish date |
| `author` | Yes | Must match an author's `name` |
| `summary` | No | Short introduction above the body |
| `image` | No | Path or URL for the post image |
| `imageAltText` | No | Alt text for the image |
| `body` | Yes | Markdown content |

The post URL is `/posts/<filename>/`. The internal `post` tag is added automatically.

## Authors

Files: `authors/*.md`

Directory defaults: `authors/authors.11tydata.js`

| Field | Required | Purpose |
|---|---|---|
| `name` | Yes | Display name and relation value |
| `image` | No | Author photo |
| `body` | Yes | Short bio |

The author URL is `/authors/<slugified-name>/`. The internal `author` tag is added automatically.

## Settings

File: `_data/settings.yml`

| Field | Purpose |
|---|---|
| `title` | Site title in the header and fallback page title |
| `description` | Fallback meta description |
| `url` | Live site URL |

## Collections

| Collection | Source | Used by |
|---|---|---|
| `collections.post` | Files tagged `post` | Blog index, post lists |
| `collections.author` | Files tagged `author` | Author index |
| `collections.nav` | Pages with `eleventyNavigation` | Main navigation |
| `collections.myAuthors` | Posts grouped by `author` | Author pages |

## CMS mapping

`admin/config.yml` must stay in sync with the front matter above.

When you add a field:

1. Add it to the Markdown sample.
2. Add it to the relevant `*.11tydata.js` file if it affects layout or URL.
3. Add it to the matching collection in `admin/config.yml`.
4. Update this document.

The CMS writes Markdown files in the same folders Eleventy reads, so there is no separate content database.
