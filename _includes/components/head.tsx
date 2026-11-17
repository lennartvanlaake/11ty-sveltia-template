import { readFileSync } from "node:fs";
import { join } from "node:path";
import { html } from "jsx-async-runtime";
import type { SiteSettings } from "../types";

type HeadProps = {
  title?: string;
  description?: string;
  generator: string;
  settings: SiteSettings;
};

export function Head({ title, description, generator, settings }: HeadProps) {
  // Read on every render so `bun run serve` picks up CSS edits.
  const css = readFileSync(
    join(process.cwd(), "_includes/assets/css/site.css"),
    "utf8",
  );

  return (
    <head>
      <meta charset="utf-8" />
      <meta name="generator" content={generator} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title || settings.title}</title>
      <meta name="description" content={description || settings.description} />
      <style>{html(css)}</style>
    </head>
  );
}
