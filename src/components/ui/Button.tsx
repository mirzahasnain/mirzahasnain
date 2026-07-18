"use client";

import { motion } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "gradient" | "outline";
  className?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
};

export function Button({
  children,
  href,
  variant = "gradient",
  className = "",
  onClick,
  target = "_blank",
  rel = "noopener noreferrer",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-heading text-sm font-semibold tracking-wide transition-transform duration-300";
  const styles =
    variant === "gradient" ? "btn-gradient" : "btn-outline-glow";

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--ripple-x", `${x}%`);
    el.style.setProperty("--ripple-y", `${y}%`);
    onClick?.();
  };

  const classes = `${base} ${styles} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        onClick={handleClick}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      className={classes}
      onClick={handleClick}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
