import { Base } from "./base";
import type { PageData } from "../types";

export default function Authors(data: PageData) {
  return (
    <Base {...data} section="author">
      <h1>{data.title}</h1>

      <section>
        {data.collections.author.map((author) => (
          <article>
            <a href={author.url}>
              {author.data.image && (
                <img
                  src={author.data.image}
                  alt={author.data.name}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <h3>{author.data.name}</h3>
            </a>
          </article>
        ))}
      </section>
    </Base>
  );
}
