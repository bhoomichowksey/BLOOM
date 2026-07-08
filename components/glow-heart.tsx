export function GlowHeart({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[#FFE0E6]" />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] opacity-90"
        style={{
          background: "radial-gradient(circle at 50% 50%, #E8748F 0%, #F4A6BC 45%, transparent 70%)",
          filter: "blur(60px)",
          clipPath:
            "path('M210 380 C 60 260, 20 140, 110 70 C 170 25, 210 60, 210 110 C 210 60, 250 25, 310 70 C 400 140, 360 260, 210 380 Z')",
        }}
      />
    </div>
  )
}
