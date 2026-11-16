import yaml from "js-yaml";
import ejsPlugin from "@11ty/eleventy-plugin-ejs";

/**
 * Eleventy configuration.
 *
 * This project deliberately keeps the build small:
 * - EJS is the only template language.
 * - Markdown is plain content (no template syntax in content files).
 * - JavaScript data files and _data/helpers.js hold computed values.
 * - No minification, image pipeline, or client-side JavaScript.
 */
export default function (eleventyConfig) {
  // EJS moved out of Eleventy core in v3. This official plugin registers it.
  eleventyConfig.addPlugin(ejsPlugin);

  // Sveltia writes site settings as YAML; teach Eleventy to read .yml data.
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));

  // Merge directory data with front matter instead of replacing it.
  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  /**
   * Flat navigation collection.
   *
   * Any page with `eleventyNavigation` in front matter is included.
   * Keep navigation flat; use the `order` field to sort items.
   */
  eleventyConfig.addCollection("nav", (collection) => {
    return collection
      .getAll()
      .filter((item) => item.data.eleventyNavigation)
      .sort((a, b) => {
        const aOrder = a.data.eleventyNavigation.order ?? 999;
        const bOrder = b.data.eleventyNavigation.order ?? 999;
        return aOrder - bOrder;
      });
  });

  /**
   * Group posts by author name.
   *
   * Author pages use this to render "All posts by ..." without a database
   * or a runtime query. The key is the author's display name.
   */
  eleventyConfig.addCollection("myAuthors", (collection) => {
    const posts = collection.getFilteredByGlob("posts/*.md");

    return posts.reduce((authors, post) => {
      const author = post.data.author;
      if (!author) {
        return authors;
      }

      if (!authors[author]) {
        authors[author] = [];
      }

      authors[author].push(post);
      return authors;
    }, {});
  });

  // Copy static files unchanged. The CMS and uploaded media are not templates.
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets/img");

  // Sveltia's local workflow conflicts with Eleventy live reload.
  eleventyConfig.setServerOptions({ liveReload: false });

  return {
    // Markdown files are content; EJS files are presentation.
    templateFormats: ["md", "ejs"],

    // Change this only if the site is deployed under a subpath.
    pathPrefix: "/",

    // Never process template syntax inside Markdown content.
    markdownTemplateEngine: false,
    htmlTemplateEngine: "ejs",
    dataTemplateEngine: "ejs",

    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
}
