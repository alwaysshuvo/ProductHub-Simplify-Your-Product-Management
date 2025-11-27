"use client";
export default function Loader() {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center gap-6 select-none">
      
      {/* Text Animation */}
      <h1 className="text-3xl font-semibold tracking-wide text-slate-800 flex gap-1">
        {["P","r","o","D","u","c","t","H","u","b"].map((letter, i) => (
          <span
            key={i}
            className="animate-bounce inline-block"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {letter}
          </span>
        ))}
      </h1>

      {/* Pulse Tagline */}
      <p className="text-slate-500 font-medium animate-pulse">
        Loading the best deals for you...
      </p>
    </div>
  );
}
