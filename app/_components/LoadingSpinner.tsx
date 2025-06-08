"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="dot-spinner">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="dot-spinner__dot"
          />
        ))}
      </div>
    </div>
  );
}
