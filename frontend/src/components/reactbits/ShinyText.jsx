export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-neutral-300 via-white to-neutral-300 bg-[length:200%_100%] animate-shimmer ${
        disabled ? '' : ''
      } ${className}`}
      style={{
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </span>
  );
}
