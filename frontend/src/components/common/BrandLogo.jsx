export default function BrandLogo({
  className = 'w-10 h-10',
  withGlow = false,
  glowClassName = 'bg-gradient-to-tr from-[#BE4B5E]/30 to-[#E295A2]/15',
  alt = 'PhotoStudio Logo',
  ...props
}) {
  if (withGlow) {
    return (
      <div className="relative flex items-center justify-center shrink-0">
        <div className={`absolute inset-0 rounded-2xl blur-md group-hover:blur-lg transition-all ${glowClassName}`} />
        <img
          src="/logo.png"
          alt={alt}
          className={`relative object-contain shrink-0 select-none pointer-events-none drop-shadow-[0_4px_12px_rgba(190,75,94,0.35)] ${className}`}
          {...props}
        />
      </div>
    );
  }

  return (
    <img
      src="/logo.png"
      alt={alt}
      className={`object-contain shrink-0 select-none pointer-events-none drop-shadow-[0_2px_8px_rgba(190,75,94,0.25)] ${className}`}
      {...props}
    />
  );
}
