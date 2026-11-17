import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import yaml from "js-yaml";
import { jsxToString } from "jsx-async-runtime";

const bundleDir = join(process.cwd(), ".cache", "tsx");
let buildVersion = 0;

async function loadTemplate(inputPath) {
  const result = await Bun.build({
    entrypoints: [inputPath],
    target: "bun",
    format: "esm",
    write: false,
  });

  if (!result.success) {
    const details = result.logs
      .map((log) => log.message ?? String(log))
      .join("\n");
    throw new Error(`Could not compile ${inputPath}:\n${details}`);
  }

  const code = await result.outputs[0].text();
  const hash = createHash("sha1").update(code).digest("hex");
  const outfile = join(bundleDir, `${hash}.mjs`);

  if (!existsSync(outfile)) {
    writeFileSync(outfile, code);
  }

  const mod = await import(pathToFileURL(outfile).href);
  return mod.default;
}

/**
 * Eleventy configuration.
 *
 * This project deliberately keeps the build small:
 * - TSX is the only template language, rendered to strings by jsx-async-runtime.
 * - Markdown is plain content (no template syntax in content files).
 * - JavaScript data files and _data/helpers.js hold computed values.
 * - No minification, image pipeline, or client-side JavaScript.
 */
export default function (eleventyConfig) {
  if (typeof Bun === "undefined") {
    throw new Error(
      "This project must be built with Bun so .tsx templates can be compiled. Run `bun run build`.",
    );
  }

  mkdirSync(bundleDir, { recursive: true });

  eleventyConfig.on("beforeBuild", () => {
    buildVersion += 1;
  });

  /**
   * Compile TSX templates with Bun.
   *
   * Each template is bundled into .cache/tsx so imported components are
   * re-read on every build. Bundles are content-addressed so changed
   * components get a new path instead of Bun's cached module.
   */
  eleventyConfig.addExtension("tsx", {
    compile: async (_content, inputPath) => {
      let loadedFor = -1;
      let templatePromise;

      return async (data) => {
        if (loadedFor !== buildVersion) {
          loadedFor = buildVersion;
          templatePromise = loadTemplate(inputPath);
        }

        const template = await templatePromise;
        return jsxToString(template({ ...data, content: data.content }));
      };
    },
  });

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
    // Markdown files are content; TSX files are presentation.
    templateFormats: ["md", "tsx"],

    // Change this only if the site is deployed under a subpath.
    pathPrefix: "/",

    // Never process template syntax inside Markdown content.
    markdownTemplateEngine: false,
    htmlTemplateEngine: false,
    dataTemplateEngine: false,

    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
}
