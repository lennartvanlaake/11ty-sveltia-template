import { html } from "jsx-async-runtime";
import { BackLink } from "../components/back-link";
import { PostList } from "../components/post-list";
import { Base } from "./base";
import type { PageData } from "../types";

export default function Author(data: PageData) {
  const name = data.name ?? data.title ?? "";

  return (
    <Base {...data} section="author">
      <h1>{name}</h1>

      {data.image && (
        <img src={data.image} alt={name} loading="lazy" decoding="async" />
      )}

      {html(data.content ?? "")}

      <p>All posts by {name}</p>

      <PostList
        posts={data.collections.myAuthors[name] ?? []}
        helpers={data.helpers}
      />

      <BackLink href="/authors/" label="Authors" />
    </Base>
  );
}
