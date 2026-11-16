import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { expect, test } from "bun:test";
import Ajv from "ajv";
import { loadCmsConfig, repoRoot } from "./helpers";

const config = loadCmsConfig();
const schemaUrl = new URL(
  "../schema/sveltia-cms.json",
  import.meta.resolve("@sveltia/cms"),
);
const schema = JSON.parse(readFileSync(schemaUrl, "utf8"));
const ajv = new Ajv({ allErrors: true, strict: false, logger: false });
const validate = ajv.compile(schema);

test("CMS config matches the Sveltia schema", () => {
  if (!validate(config)) {
    throw new Error(ajv.errorsText(validate.errors, { separator: "\n" }));
  }
});

test("CMS paths, formats, and media settings are valid", () => {
  const names = config.collections.map((collection) => collection.name);
  expect(new Set(names).size).toBe(names.length);

  const missing: string[] = [];

  for (const collection of config.collections) {
    if (collection.folder && !existsSync(join(repoRoot, collection.folder))) {
      missing.push(`${collection.name}: folder ${collection.folder}`);
    }

    for (const file of collection.files ?? []) {
      if (!existsSync(join(repoRoot, file.file))) {
        missing.push(`${collection.name}/${file.name}: ${file.file}`);
      }
    }
  }

  expect(missing).toEqual([]);

  const expectedFormat: Record<string, string> = {
    ".json": "json",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".toml": "toml",
  };
  const formatMismatches: string[] = [];

  for (const collection of config.collections) {
    for (const file of collection.files ?? []) {
      const expected = expectedFormat[extname(file.file)];
      if (file.format && expected && file.format !== expected) {
        formatMismatches.push(
          `${collection.name}/${file.name}: ${file.format} does not match ${extname(file.file)}`,
        );
      }
    }
  }

  expect(formatMismatches).toEqual([]);

  expect(config.media_folder).toBeTruthy();
  expect(config.public_folder).toBeTruthy();

  const mediaFolder = config.media_folder!;
  expect(statSync(join(repoRoot, mediaFolder)).isDirectory()).toBe(true);
  expect(config.public_folder).toBe(`/${mediaFolder.replace(/^\/+/, "")}`);
});
