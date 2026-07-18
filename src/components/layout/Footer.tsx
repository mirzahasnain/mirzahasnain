"use client";

import { LINKS, SITE } from "@/lib/constants";
import { motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";

const socials = [
  { label: "Telegram", href: LINKS.telegram, icon: Send },
  { label: "X", href: LINKS.twitter, icon: X },
  { label: "Discord", href: LINKS.discord, icon: MessageCircle },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-space-950/60">
      <div className="container-site section-pad !py-12">
        <motion.div
          className="flex flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <a href="#home" className="font-heading text-2xl font-bold tracking-[0.28em] text-white">
            {SITE.name}
          </a>
          <p className="font-heading text-sm uppercase tracking-[0.2em]">
            <span className="text-white">Born Weird. </span>
            <span className="text-neon-pink">Built to Meme.</span>
          </p>
          <div className="flex items-center gap-4">
            {socials.map(({ label, href, icon: Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="glass flex h-11 w-11 items-center justify-center rounded-full text-neon-blue transition-colors hover:text-neon-pink"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
          <p className="text-sm text-text-muted">© {SITE.year} NIBBO</p>
        </motion.div>
      </div>
    </footer>
  );
}
