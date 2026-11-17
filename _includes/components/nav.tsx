import type { NavEntry } from "../types";

type NavProps = {
  entries: NavEntry[];
  currentUrl: string;
};

export function Nav({ entries, currentUrl }: NavProps) {
  return (
    <nav aria-label="Main">
      <ul>
        {entries.map((entry) => (
          <li>
            <a
              href={entry.url}
              aria-current={entry.url === currentUrl ? "page" : undefined}
            >
              {entry.data.eleventyNavigation?.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
