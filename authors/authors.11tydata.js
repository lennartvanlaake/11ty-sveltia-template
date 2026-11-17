import { slugify } from "../_data/helpers.js";

/**
 * Directory data for authors/*.md.
 *
 * Every author gets:
 * - the shared author layout
 * - the internal "author" tag used by collections.author
 * - a URL based on the author's display name, e.g. "Jane Doe" -> /authors/jane-doe/
 */
export default {
  layout: "layouts/author.tsx",
  tags: ["author"],
  permalink: (data) => `/authors/${slugify(data.name)}/`,
  eleventyComputed: {
    // Use the author's display name for the page title and description.
    title: (data) => data.name,
    description: (data) => `Posts by ${data.name}.`,
  },
};
