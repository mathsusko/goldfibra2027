import type { Metadata, Viewport } from "next";
import { Fragment_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = Fragment_Mono({ subsets: ["latin"], weight: "400", variable: "--font-fragment", display: "swap" });

export const metadata: Metadata = {
  title: "Goldfibra | Internet de fibra óptica em Arapongas",
  description:
    "Planos de internet 100% fibra óptica em Arapongas e região: 600 Mega, 800 Mega e 1 Giga, com Wi-Fi 6G, instalação grátis e R$20 de desconto pagando em dia.",
};

export const viewport: Viewport = { themeColor: "#000000" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
