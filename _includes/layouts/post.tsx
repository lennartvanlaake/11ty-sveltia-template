import { html } from "jsx-async-runtime";
import { BackLink } from "../components/back-link";
import { Base } from "./base";
import type { PageData } from "../types";

export default function Post(data: PageData) {
  return (
    <Base {...data} section="post">
      <article>
        <h1>{data.title}</h1>

        {data.summary && <p>{data.summary}</p>}

        <p>
          <small>
            Posted on{" "}
            <time datetime={data.helpers.machineDate(data.page.date)}>
              {data.helpers.readableDate(data.page.date)}
            </time>
            {data.author && (
              <>
                {" by "}
                <a href={`/authors/${data.helpers.slug(data.author)}/`}>
                  {data.author}
                </a>
              </>
            )}
          </small>
        </p>

        {data.image && (
          <img
            src={data.image}
            alt={data.imageAltText || data.title}
            loading="lazy"
            decoding="async"
          />
        )}

        {html(data.content ?? "")}
      </article>

      <BackLink href="/posts/" label="Blog" />
    </Base>
  );
}
