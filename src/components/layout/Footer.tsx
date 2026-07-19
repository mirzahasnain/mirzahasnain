"use client";

import { LINKS, SITE } from "@/lib/constants";
import { motion } from "framer-motion";
import { Camera, Mail, Send, X } from "lucide-react";
import type { ReactNode } from "react";

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 .5C5.73.5.75 5.58.75 11.96c0 5.05 3.19 9.33 7.62 10.84.56.11.76-.25.76-.55 0-.27-.01-1.16-.02-2.1-3.1.69-3.75-1.35-3.75-1.35-.51-1.32-1.24-1.67-1.24-1.67-1.01-.71.08-.7.08-.7 1.12.08 1.71 1.18 1.71 1.18.99 1.74 2.6 1.24 3.23.95.1-.74.39-1.24.71-1.52-2.47-.29-5.07-1.27-5.07-5.64 0-1.25.43-2.26 1.14-3.06-.11-.29-.5-1.46.11-3.04 0 0 .93-.3 3.05 1.17a10.3 10.3 0 0 1 5.55 0c2.12-1.47 3.05-1.17 3.05-1.17.61 1.58.22 2.75.11 3.04.71.8 1.14 1.81 1.14 3.06 0 4.38-2.61 5.35-5.09 5.63.4.35.75 1.04.75 2.1 0 1.52-.01 2.74-.01 3.11 0 .3.2.66.77.55A11.22 11.22 0 0 0 23.25 12C23.25 5.58 18.27.5 12 .5Z" />
    </svg>
  );
}

const socials: {
  label: string;
  href: string;
  icon: (props: { size?: number }) => ReactNode;
}[] = [
  { label: "X", href: LINKS.twitter, icon: X },
  { label: "Instagram", href: LINKS.instagram, icon: Camera },
  { label: "Telegram", href: LINKS.telegram, icon: Send },
  { label: "Email", href: LINKS.email, icon: Mail },
  { label: "GitHub", href: LINKS.github, icon: GitHubIcon },
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
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {socials.map(({ label, href, icon: Icon }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
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
