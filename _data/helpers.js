/**
 * Presentation helpers shared by TSX templates and directory data files.
 *
 * Keep logic here (or in .11tydata.js files) instead of inside templates.
 * TSX templates should render values; they should not compute slugs or dates.
 */

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

/**
 * Convert a display string into a URL-safe slug.
 * Example: "Jane Doe" -> "jane-doe"
 */
export function slug(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Alias used by data files that prefer a verb-like name.
export const slugify = slug;

/**
 * Human-readable date for visible page content.
 * Example: "Jan 1, 2026"
 */
export function readableDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return dateFormatter.format(date);
}

/**
 * Machine-readable date for the <time datetime="..."> attribute.
 * Example: "2026-01-01"
 */
export function machineDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

// Eleventy exposes the module namespace as `helpers`.
// The default export keeps the module pleasant to import from plain JS.
export default {
  slug,
  readableDate,
  machineDate,
};
