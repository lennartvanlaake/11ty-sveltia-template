import type { CollectionItem, Helpers } from "../types";

type PostListProps = {
  posts: CollectionItem[];
  helpers: Helpers;
};

export function PostList({ posts, helpers }: PostListProps) {
  return (
    <>
      {posts.length > 0 && (
        <p>
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      )}

      <section>
        {[...posts].reverse().map((post) => (
          <article>
            <a href={post.url}>
              {post.data.image && (
                <img
                  src={post.data.image}
                  alt={post.data.imageAltText || post.data.title}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <h3>{post.data.title}</h3>
            </a>

            <time datetime={helpers.machineDate(post.date)}>
              <small>
                {helpers.readableDate(post.date)}
                {post.data.author && (
                  <>
                    {" by "}
                    <a href={`/authors/${helpers.slug(post.data.author)}/`}>
                      {post.data.author}
                    </a>
                  </>
                )}
              </small>
            </time>
          </article>
        ))}
      </section>
    </>
  );
}
