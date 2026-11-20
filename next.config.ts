import type { NextConfig } from "next";

const PAGINA = "/viagem/msc-world-asia-2027/programa-completo/index.html";

const nextConfig: NextConfig = {
  // A página do programa de grupo é um ficheiro estático em /public. O Next não
  // serve "index.html" por pasta, por isso estes endereços limpos apontam para ele.
  async rewrites() {
    return [
      { source: "/viagem/msc-world-asia-2027", destination: PAGINA },
      { source: "/viagem/msc-world-asia-2027/programa-completo", destination: PAGINA },
    ];
  },
};

export default nextConfig;
