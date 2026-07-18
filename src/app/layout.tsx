import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nibbo.fun"),
  title: "NIBBO | Born Weird. Built to Meme.",
  description:
    "NIBBO is a mysterious little creature from another galaxy that landed on Solana to spread memes, fun, and community.",
  openGraph: {
    title: "NIBBO | Born Weird. Built to Meme.",
    description:
      "A Solana meme coin powered by weirdness, community, and cosmic vibes.",
    images: ["/nibbo-mascot.png"],
  },
  icons: {
    icon: "/nibbo-mascot.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${orbitron.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
