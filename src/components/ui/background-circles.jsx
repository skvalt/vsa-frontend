import { motion } from "framer-motion";
import clsx from "clsx";

const COLOR_VARIANTS = {
  secondary: {
    border: [
      "border-violet-500/40",
      "border-fuchsia-400/30",
      "border-slate-500/20",
    ],
    glow1: "from-violet-500/30",
    glow2: "from-fuchsia-500/20",
  },

  primary: {
    border: [
      "border-emerald-400/40",
      "border-cyan-400/30",
      "border-slate-500/20",
    ],
    glow1: "from-emerald-400/30",
    glow2: "from-cyan-400/20",
  },

  octonary: {
    border: [
      "border-red-500/40",
      "border-rose-400/30",
      "border-slate-500/20",
    ],
    glow1: "from-red-500/30",
    glow2: "from-rose-400/20",
  },
};

export function BackgroundCircles({ variant = "secondary", className = "" }) {
  const v = COLOR_VARIANTS[variant];

  return (
    <div
      className={clsx(
        "absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center",
        "z-0", // ensures visible behind everything
        className
      )}
    >
      {/* Animated lines / grid */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ["0% 0%", "200% 200%"],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "repeating-linear-gradient(120deg, rgba(100,116,139,0.4) 0px, rgba(100,116,139,0.4) 2px, transparent 2px, transparent 8px)",
        }}
      />

      {/* Rotating main circles */}
      <motion.div className="absolute h-[160vh] w-[160vh] max-w-none max-h-none">

        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={clsx(
              "absolute inset-0 rounded-full border-2 bg-gradient-to-br to-transparent",
              v.border[i],
              v.glow1
            )}
            animate={{
              rotate: 360,
              scale: [1, 1.05 + i * 0.04, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 6 + i * 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Glow layers */}
      <div className="absolute inset-0">
        <div
          className={clsx(
            "absolute inset-0 blur-[110px] opacity-40 bg-gradient-to-br to-transparent",
            v.glow1
          )}
        />

        <div
          className={clsx(
            "absolute inset-0 blur-[90px] opacity-30 bg-gradient-to-tr to-transparent",
            v.glow2
          )}
        />
      </div>
    </div>
  );
}
