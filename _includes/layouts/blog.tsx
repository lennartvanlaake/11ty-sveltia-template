import { html } from "jsx-async-runtime";
import { PostList } from "../components/post-list";
import { Base } from "./base";
import type { PageData } from "../types";

export default function Blog(data: PageData) {
  return (
    <Base {...data} section="blog">
      <h1>{data.title}</h1>
      {html(data.content ?? "")}
      <PostList posts={data.collections.post} helpers={data.helpers} />
    </Base>
  );
}
