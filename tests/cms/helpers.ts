import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { dump, JSON_SCHEMA, load } from "js-yaml";
import { slug } from "../../_data/helpers.js";

export type CmsField = {
  name?: string;
  label?: string;
  widget?: string;
  required?: boolean | string[];
  fields?: CmsField[];
  types?: CmsField[];
  field?: CmsField | string;
  multiple?: boolean;
  options?: Array<string | number | { value: string | number }>;
  [key: string]: unknown;
};

export type CmsFile = {
  name: string;
  file: string;
  format?: string;
  fields: CmsField[];
  [key: string]: unknown;
};

export type CmsCollection = {
  name: string;
  folder?: string;
  fields?: CmsField[];
  files?: CmsFile[];
  [key: string]: unknown;
};

export type CmsConfig = {
  media_folder?: string;
  public_folder?: string;
  collections: CmsCollection[];
  [key: string]: unknown;
};

export type FixtureTokens = {
  id: string;
  postSlug: string;
  postTitle: string;
  postSummary: string;
  postBody: string;
  authorName: string;
  authorSlug: string;
  authorBody: string;
  authorImage: string;
  pageTitle: string;
  pageDescription: string;
  pageBody: string;
  homeTitle: string;
  homeBody: string;
  blogTitle: string;
  blogBody: string;
  settingsTitle: string;
  settingsDescription: string;
  settingsUrl: string;
};

export type FixtureSite = {
  root: string;
  siteDir: string;
  tokens: FixtureTokens;
  cleanup: () => void;
};

export const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

export function loadCmsConfig(): CmsConfig {
  return load(readFileSync(join(repoRoot, "admin/config.yml"), "utf8")) as CmsConfig;
}

export function readMarkdown(filePath: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const text = readFileSync(filePath, "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Missing YAML front matter in ${filePath}`);
  }

  return {
    data: load(match[1], { schema: JSON_SCHEMA }) as Record<string, unknown>,
    body: match[2] ?? "",
  };
}

export function writeMarkdown(
  filePath: string,
  data: Record<string, unknown>,
  body: string,
): void {
  mkdirSync(dirname(filePath), { recursive: true });
  const frontMatter = dump(data, { noRefs: true, lineWidth: 100 }).trimEnd();
  writeFileSync(filePath, `---\n${frontMatter}\n---\n\n${body.trim()}\n`, "utf8");
}

export function writeYaml(filePath: string, data: Record<string, unknown>): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, dump(data, { noRefs: true, lineWidth: 100 }), "utf8");
}

export function readHtml(siteDir: string, url: string): string {
  const clean = url.split("?")[0].split("#")[0];
  const relativePath = clean.replace(/^\//, "");
  const filePath =
    clean === "/" || clean.endsWith("/")
      ? join(siteDir, relativePath, "index.html")
      : join(siteDir, relativePath);

  if (!existsSync(filePath)) {
    throw new Error(`Missing built HTML for ${url}: ${filePath}`);
  }

  return readFileSync(filePath, "utf8");
}

export function runBuild(cwd: string): void {
  const result = spawnSync(process.execPath, ["run", "build"], {
    cwd,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(
      [
        `Eleventy build failed in ${cwd}`,
        "",
        "STDOUT:",
        result.stdout ?? "",
        "",
        "STDERR:",
        result.stderr ?? "",
      ].join("\n"),
    );
  }
}

export function buildRealSite(): void {
  rmSync(join(repoRoot, "_site"), { recursive: true, force: true });
  runBuild(repoRoot);
}

function findCollection(config: CmsConfig, name: string): CmsCollection {
  const collection = config.collections.find((candidate) => candidate.name === name);

  if (!collection) {
    throw new Error(`Missing CMS collection: ${name}`);
  }

  return collection;
}

function fieldsFor(collection: CmsCollection): CmsField[] {
  if (collection.fields) {
    return collection.fields;
  }

  const file = collection.files?.[0];
  if (!file) {
    throw new Error(`Collection ${collection.name} has no fields`);
  }

  return file.fields;
}

function generateValue(field: CmsField): unknown {
  if (field.fields) {
    return Object.fromEntries(
      field.fields
        .filter((child) => child.name)
        .map((child) => [child.name!, generateValue(child)]),
    );
  }

  switch (field.widget) {
    case "number":
      return 1;
    case "boolean":
      return true;
    case "list":
      return ["fixture"];
    case "datetime":
      return "2026-01-01";
    case "object":
    case "map":
    case "keyvalue":
      return {};
    case "hidden":
    case "compute":
      return undefined;
    default:
      return `fixture-${field.name ?? "value"}`;
  }
}

function valuesFor(
  fields: CmsField[],
  overrides: Record<string, unknown>,
): Record<string, unknown> {
  const values: Record<string, unknown> = {};

  for (const field of fields) {
    if (!field.name || field.name === "body") {
      continue;
    }

    if (field.name in overrides) {
      values[field.name] = overrides[field.name];
      continue;
    }

    const value = generateValue(field);
    if (value !== undefined) {
      values[field.name] = value;
    }
  }

  return values;
}

function makeTokens(): FixtureTokens {
  const id = crypto.randomUUID().slice(0, 8);
  const authorName = `Fixture Author ${id}`;

  return {
    id,
    postSlug: `fixture-post-${id}`,
    postTitle: `Fixture post ${id}`,
    postSummary: `Fixture summary ${id}`,
    postBody: `Fixture post body ${id}`,
    authorName,
    authorSlug: slug(authorName),
    authorBody: `Fixture author body ${id}`,
    authorImage: `/assets/img/fixture-author-${id}.png`,
    pageTitle: `Fixture page ${id}`,
    pageDescription: `Fixture page description ${id}`,
    pageBody: `Fixture page body ${id}`,
    homeTitle: `Fixture home ${id}`,
    homeBody: `Fixture home body ${id}`,
    blogTitle: `Fixture blog ${id}`,
    blogBody: `Fixture blog body ${id}`,
    settingsTitle: `Fixture site ${id}`,
    settingsDescription: `Fixture site description ${id}`,
    settingsUrl: "https://example.test",
  };
}

/**
 * Builds a throwaway Eleventy site using the real config and layouts.
 *
 * The content is generated from the CMS field definitions, so the test is
 * independent of the repository's sample content. Renaming a sample author
 * or editing any other real content value does not affect this fixture.
 */
export function createFixtureSite(): FixtureSite {
  const config = loadCmsConfig();
  const tokens = makeTokens();
  const root = mkdtempSync(join(tmpdir(), "11ty-cms-flow-"));
  const cleanup = () => rmSync(root, { recursive: true, force: true });

  try {
    for (const name of ["_includes", "admin", "assets"]) {
      cpSync(join(repoRoot, name), join(root, name), { recursive: true });
    }

    mkdirSync(join(root, "_data"), { recursive: true });
    cpSync(join(repoRoot, "_data/helpers.js"), join(root, "_data/helpers.js"));
    cpSync(join(repoRoot, "eleventy.config.js"), join(root, "eleventy.config.js"));
    cpSync(join(repoRoot, "package.json"), join(root, "package.json"));
    cpSync(join(repoRoot, "authors.ejs"), join(root, "authors.ejs"));

    for (const name of ["pages", "posts", "authors"]) {
      mkdirSync(join(root, name), { recursive: true });
      cpSync(
        join(repoRoot, `${name}/${name}.11tydata.js`),
        join(root, `${name}/${name}.11tydata.js`),
      );
    }

    symlinkSync(join(repoRoot, "node_modules"), join(root, "node_modules"), "dir");

    const postFields = fieldsFor(findCollection(config, "posts"));
    const pageFields = fieldsFor(findCollection(config, "pages"));
    const authorFields = fieldsFor(findCollection(config, "authors"));
    const settingsFields = fieldsFor(findCollection(config, "settings"));

    writeMarkdown(
      join(root, "authors", `${tokens.authorSlug}.md`),
      valuesFor(authorFields, {
        name: tokens.authorName,
        image: tokens.authorImage,
      }),
      tokens.authorBody,
    );

    writeMarkdown(
      join(root, "posts", `${tokens.postSlug}.md`),
      valuesFor(postFields, {
        title: tokens.postTitle,
        date: "2026-01-01",
        author: tokens.authorName,
        summary: tokens.postSummary,
      }),
      tokens.postBody,
    );

    writeMarkdown(
      join(root, "pages", "about.md"),
      valuesFor(pageFields, {
        title: tokens.pageTitle,
        description: tokens.pageDescription,
      }),
      tokens.pageBody,
    );

    const homeData = valuesFor(pageFields, {
      title: tokens.homeTitle,
      description: tokens.pageDescription,
    });
    homeData.permalink = "/";
    writeMarkdown(join(root, "pages", "home.md"), homeData, tokens.homeBody);

    const blogData = valuesFor(pageFields, {
      title: tokens.blogTitle,
      description: tokens.pageDescription,
    });
    blogData.layout = "layouts/blog.ejs";
    blogData.permalink = "/posts/index.html";
    writeMarkdown(join(root, "pages", "blog.md"), blogData, tokens.blogBody);

    writeYaml(
      join(root, "_data", "settings.yml"),
      valuesFor(settingsFields, {
        title: tokens.settingsTitle,
        description: tokens.settingsDescription,
        url: tokens.settingsUrl,
      }),
    );

    runBuild(root);

    return {
      root,
      siteDir: join(root, "_site"),
      tokens,
      cleanup,
    };
  } catch (error) {
    cleanup();
    throw error;
  }
}
