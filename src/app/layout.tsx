import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import { application } from "@/config/application";
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
  metadataBase: new URL("https://tradeimpact.app"),
  title: {
    default: `${application.name} | ${application.tagline}`,
    template: `%s | ${application.name}`,
  },
  description: application.disclaimer,
  openGraph: {
    title: application.name,
    description: application.tagline,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The News Bias Tool applies its saved theme to <html> before hydration.
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
