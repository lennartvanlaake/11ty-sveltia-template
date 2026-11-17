/**
 * Directory data for pages/*.md.
 *
 * Every page gets:
 * - the shared page layout
 * - a URL based on its filename, e.g. pages/about.md -> /about/
 *
 * Individual pages can override either value in front matter.
 * Example: pages/home.md overrides permalink to "/".
 */
export default {
  layout: "layouts/page.tsx",
  permalink: (data) => `/${data.page.fileSlug}/`,
};
