type BackLinkProps = {
  href: string;
  label: string;
};

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <nav aria-label="Section navigation">
      <a href={href}>← {label} index</a>
    </nav>
  );
}
