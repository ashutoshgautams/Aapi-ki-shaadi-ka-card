import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, Jost, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "600"],
  variable: "--font-nastaliq",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nemat & Bakhtiyar",
  description:
    "The wedding of Dr. Nemat Aafreen and Er. Bakhtiyar Alam — Kishan Palace, Patna, 24 October 2026.",
  openGraph: {
    title: "Nemat & Bakhtiyar — 24 October 2026",
    description: "You are invited to the nikah at Kishan Palace, Patna.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfdfe",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${cormorant.variable} ${jost.variable} ${amiri.variable} ${nastaliq.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
