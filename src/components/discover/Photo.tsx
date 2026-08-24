type PhotoProps = {
  src: string;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function Photo({ src, alt = "", className, sizes, priority }: PhotoProps) {
  const api = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
  const href = src.startsWith("http") || src.startsWith("data:") || src.startsWith("//") ? src : `${api}${src.startsWith("/") ? src : `/${src}`}`;
  return (
    // Remote catalog photos; next/image host allowlist requires a full Next restart.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={href}
      alt={alt}
      className={className}
      sizes={sizes}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
