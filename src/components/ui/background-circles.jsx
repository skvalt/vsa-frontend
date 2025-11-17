export function BackgroundCircles({ className = "" }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{
        background: `
          radial-gradient(circle at center,
            rgba(173, 216, 255, 1) 0%,
            rgba(120, 165, 240, 0.9) 40%,
            rgba(55, 110, 200, 1) 80%
          )
        `,
      }}
    />
  );
}
