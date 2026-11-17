/**
 * Directory data for posts/*.md.
 *
 * Every post gets:
 * - the shared post layout
 * - the internal "post" tag used by collections.post
 * - a URL based on its filename, e.g. posts/hello-world.md -> /posts/hello-world/
 *
 * The CMS creates files using the slug from the title, so filenames stay stable.
 */
export default {
  layout: "layouts/post.tsx",
  tags: ["post"],
  permalink: (data) => `/posts/${data.page.fileSlug}/`,
};
