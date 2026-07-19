"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

type CopyButtonProps = {
  value: string;
  className?: string;
};

export function CopyButton({ value, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy contract address"}
      className={`btn-outline-glow inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-heading text-xs font-semibold tracking-wide ${className}`}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy"}
    </motion.button>
  );
}
