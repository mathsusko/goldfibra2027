import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Goldfibra | Internet de fibra óptica em Arapongas",
  description:
    "Planos de internet 100% fibra óptica em Arapongas e região: 600 Mega, 800 Mega e 1 Giga, com R$20 de desconto pagando em dia.",
};

export const viewport: Viewport = {
  themeColor: "#eef0f8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-tone="light" className={archivo.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
