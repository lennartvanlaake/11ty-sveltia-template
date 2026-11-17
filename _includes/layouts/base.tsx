import { html } from "jsx-async-runtime";
import { Footer } from "../components/footer";
import { Head } from "../components/head";
import { Nav } from "../components/nav";
import type { PageData } from "../types";

type BaseProps = PageData & {
  children?: JSX.Element;
};

export function Base({
  title,
  description,
  section,
  settings,
  collections,
  page,
  eleventy,
  children,
}: BaseProps) {
  return (
    <>
      {html("<!doctype html>")}
      <html lang="en" data-current={section}>
        <Head
          title={title}
          description={description}
          generator={eleventy.generator}
          settings={settings}
        />
        <body>
          <a class="skip-link" href="#main">
            Skip to content
          </a>

          <header>
            <em>
              <a href="/">{settings.title}</a>
            </em>
            <Nav entries={collections.nav} currentUrl={page.url} />
          </header>

          <main id="main">{children}</main>

          <Footer />
        </body>
      </html>
    </>
  );
}
