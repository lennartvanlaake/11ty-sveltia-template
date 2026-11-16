import { afterAll, beforeAll, expect, test } from "bun:test";
import { createFixtureSite, readHtml, type FixtureSite } from "./helpers";

let fixture!: FixtureSite;

beforeAll(() => {
  fixture = createFixtureSite();
});

afterAll(() => {
  fixture?.cleanup();
});

test("post CMS fields render", () => {
  const html = readHtml(
    fixture.siteDir,
    `/posts/${fixture.tokens.postSlug}/`,
  );

  expect(html).toContain(fixture.tokens.postTitle);
  expect(html).toContain(fixture.tokens.postSummary);
  expect(html).toContain(fixture.tokens.postBody);
  expect(html).toContain(fixture.tokens.authorName);
});

test("page CMS fields render", () => {
  const html = readHtml(fixture.siteDir, "/about/");

  expect(html).toContain(fixture.tokens.pageTitle);
  expect(html).toContain(fixture.tokens.pageBody);
});

test("author CMS fields render", () => {
  const index = readHtml(fixture.siteDir, "/authors/");
  expect(index).toContain(fixture.tokens.authorName);

  const detail = readHtml(
    fixture.siteDir,
    `/authors/${fixture.tokens.authorSlug}/`,
  );
  expect(detail).toContain(fixture.tokens.authorName);
  expect(detail).toContain(fixture.tokens.authorBody);
  expect(detail).toContain(fixture.tokens.authorImage);
});

test("settings CMS fields render", () => {
  const html = readHtml(fixture.siteDir, "/");
  expect(html).toContain(fixture.tokens.settingsTitle);
});
