export function BackgroundCircles({ className = "" }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{
        background: `
          radial-gradient(circle at center,
            rgba(117, 145, 176, 1) 0%,
            rgba(81, 111, 163, 0.68) 40%,
            rgba(32, 57, 98, 1) 80%
          )
        `,
      }}
    />
  );
}
