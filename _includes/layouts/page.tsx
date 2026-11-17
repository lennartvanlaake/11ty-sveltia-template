import { html } from "jsx-async-runtime";
import { Base } from "./base";
import type { PageData } from "../types";

export default function Page(data: PageData) {
  return (
    <Base {...data} section="page">
      <h1>{data.title}</h1>
      {html(data.content ?? "")}
    </Base>
  );
}
