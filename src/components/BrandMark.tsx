export function BrandMark({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="18.25" cy="18.5" r="8.25" stroke="currentColor" strokeWidth="1.85" />
      <circle cx="18.25" cy="18.5" r="4.85" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8.2 5.2v7.4c0 1.55 1.15 2.6 2.55 2.6s2.55-1.05 2.55-2.6V5.2"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
      />
      <path d="M8.2 5.2v4.2M10.75 5.2v4.2M13.3 5.2v4.2" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
      <path d="M10.75 15.2v11.2" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
    </svg>
  );
}
