import { existsSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, expect, test } from "bun:test";
import { buildRealSite, repoRoot } from "./helpers";

beforeAll(() => {
  buildRealSite();
});

test("Eleventy compiles the real site", () => {
  const expectedFiles = [
    "index.html",
    "404.html",
    "posts/index.html",
    "authors/index.html",
    "admin/config.yml",
  ];

  const missing = expectedFiles.filter(
    (file) => !existsSync(join(repoRoot, "_site", file)),
  );

  expect(missing).toEqual([]);
});
