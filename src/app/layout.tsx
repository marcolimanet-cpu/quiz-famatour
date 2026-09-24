import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Descobre o teu Destino | Famatour",
  description:
    "Responde a algumas perguntas rápidas e descobre qual é o destino de férias ideal para ti — sugerido pela Famatour.",
  openGraph: {
    title: "Descobre o teu Destino | Famatour",
    description:
      "Responde a algumas perguntas rápidas e descobre qual é o destino de férias ideal para ti.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt"
      className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-azul-950">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
