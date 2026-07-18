"use client";

import { motion } from "framer-motion";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <motion.div
      className={`mb-12 flex flex-col gap-4 ${alignment}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {eyebrow ? (
        <span className="font-heading text-xs uppercase tracking-[0.35em] text-neon-blue">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-heading text-3xl font-bold tracking-wide text-white sm:text-4xl md:text-5xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
