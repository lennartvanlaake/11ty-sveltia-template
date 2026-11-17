# Conventions

## TSX

TSX is the only template language. Templates are functions rendered to strings by `jsx-async-runtime`.

```tsx
{value}                    escaped text
<h1>{title}</h1>           element
{condition && <p>...</p>}  conditional
{html(content)}            rendered Markdown (raw)
```

Rules:

- Use `{value}` by default so text is escaped.
- Use `html()` only for rendered Markdown (`content`) and the stylesheet.
- Type props with `PageData` from `_includes/types.ts`.
- Pass data to components explicitly as props.
- Keep templates declarative. Do not compute slugs, format dates, sort collections, or fetch data inside a template.

Good:

```tsx
<time datetime={helpers.machineDate(page.date)}>
  {helpers.readableDate(page.date)}
</time>
```

Bad:

```tsx
<time datetime={page.date.toISOString().slice(0, 10)}>
  {page.date.toLocaleDateString("en", { dateStyle: "medium" })}
</time>
```

The bad version duplicates logic that belongs in `_data/helpers.js`.

## Helpers and data

Use:

- `_data/helpers.js` for presentation helpers such as slugs and dates.
- `*.11tydata.js` for folder-wide layout, URL, and tag defaults.
- `eleventy.config.js` for collections and build configuration.

If a value is used by more than one template, put it in a helper or data file.

## HTML

- Use semantic elements: `header`, `nav`, `main`, `article`, `footer`, `time`.
- Include a skip link.
- Use `aria-current="page"` for the active navigation item.
- Every image needs meaningful `alt` text.
- Do not add client-side JavaScript unless explicitly requested.

## CSS

- Keep CSS in `_includes/assets/css/site.css`.
- Use the existing custom properties in `:root`.
- Prefer layout primitives: grid, `max-width`, and `gap`.
- Preserve visible focus styles.
- Do not add inline styles.

## Accessibility checklist

- Page has one `h1`.
- Heading levels are sequential.
- Links describe their destination.
- Images have appropriate alt text.
- Keyboard focus is visible.
- Color contrast is sufficient.
- The page works without JavaScript.

## SEO checklist

- Every page has a unique `title`.
- Every page has a useful `description`.
- Post dates are rendered in a `<time>` element.
- URLs are stable and lowercase.
- Internal links point to real pages.
