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

const TITULO_SITE = "Descobre o teu destino de férias | Famatour";
const DESCRICAO_SITE =
  "Responde a um quiz rápido e divertido e descobre qual é o teu destino de férias ideal — sugerido pela Famatour.";

// A meta root layout não corre por pedido (ao contrário de /resultado/[id] e
// /guia/[destino], que sabem o host real via urlBaseAbsoluta()) — por isso,
// se NEXT_PUBLIC_SITE_URL não estiver definida, cai no domínio de produção
// em vez de "localhost", que ficaria inválido numa pré-visualização real.
const URL_BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://quiz-famatour.vercel.app");

const IMAGEM_OG_INICIO = `${URL_BASE}/images/og/inicio.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(URL_BASE),
  title: TITULO_SITE,
  description: DESCRICAO_SITE,
  openGraph: {
    title: TITULO_SITE,
    description: DESCRICAO_SITE,
    type: "website",
    url: URL_BASE,
    images: [
      {
        url: IMAGEM_OG_INICIO,
        width: 1200,
        height: 630,
        alt: "Descobre o teu Destino - Famatour",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO_SITE,
    description: DESCRICAO_SITE,
    images: [IMAGEM_OG_INICIO],
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
