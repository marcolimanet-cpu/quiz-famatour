"use client";

import type { Destino } from "@/types/quiz";

/**
 * Gera o cartão de partilha (formato vertical tipo Stories, 1080x1920): a
 * foto real do destino como fundo, o logótipo da Famatour e o nome do
 * destino sobrepostos com um gradiente para legibilidade. Devolve um Blob
 * (em vez de data URL) porque é o formato que a Web Share API espera para
 * partilhar como ficheiro.
 */
function quebrarLinhas(
  ctx: CanvasRenderingContext2D,
  texto: string,
  larguraMaxima: number
): string[] {
  const palavras = texto.split(" ");
  const linhas: string[] = [];
  let linhaAtual = "";

  for (const palavra of palavras) {
    const tentativa = linhaAtual ? `${linhaAtual} ${palavra}` : palavra;
    if (ctx.measureText(tentativa).width > larguraMaxima && linhaAtual) {
      linhas.push(linhaAtual);
      linhaAtual = palavra;
    } else {
      linhaAtual = tentativa;
    }
  }
  if (linhaAtual) linhas.push(linhaAtual);
  return linhas;
}

function carregarImagem(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`falha ao carregar ${src}`));
    img.src = src;
  });
}

/** Desenha `img` a preencher todo o retângulo alvo, cortando o excedente (comportamento "cover" do CSS). */
function desenharImagemCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  largura: number,
  altura: number
) {
  const rácioImagem = img.width / img.height;
  const rácioAlvo = largura / altura;

  let sLargura = img.width;
  let sAltura = img.height;
  let sx = 0;
  let sy = 0;

  if (rácioImagem > rácioAlvo) {
    sLargura = img.height * rácioAlvo;
    sx = (img.width - sLargura) / 2;
  } else {
    sAltura = img.width / rácioAlvo;
    sy = (img.height - sAltura) / 2;
  }

  ctx.drawImage(img, sx, sy, sLargura, sAltura, 0, 0, largura, altura);
}

export async function gerarCartaoPartilha(destino: Destino): Promise<Blob | null> {
  const largura = 1080;
  const altura = 1920;

  const canvas = document.createElement("canvas");
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  try {
    const [foto, logo] = await Promise.all([
      carregarImagem(`/images/destinos/${destino.chave}/1.jpg`),
      carregarImagem("/images/brand/logo-branco.png"),
    ]);

    desenharImagemCover(ctx, foto, largura, altura);

    const gradienteTopo = ctx.createLinearGradient(0, 0, 0, altura * 0.22);
    gradienteTopo.addColorStop(0, "rgba(8, 20, 40, 0.6)");
    gradienteTopo.addColorStop(1, "rgba(8, 20, 40, 0)");
    ctx.fillStyle = gradienteTopo;
    ctx.fillRect(0, 0, largura, altura * 0.22);

    const gradienteFundo = ctx.createLinearGradient(0, altura * 0.38, 0, altura);
    gradienteFundo.addColorStop(0, "rgba(8, 20, 40, 0)");
    gradienteFundo.addColorStop(0.55, "rgba(8, 20, 40, 0.78)");
    gradienteFundo.addColorStop(1, "rgba(8, 20, 40, 0.95)");
    ctx.fillStyle = gradienteFundo;
    ctx.fillRect(0, altura * 0.38, largura, altura * 0.62);

    const larguraLogo = 280;
    const alturaLogo = (logo.height / logo.width) * larguraLogo;
    ctx.drawImage(logo, 80, 90, larguraLogo, alturaLogo);
  } catch {
    // Foto ou logótipo indisponíveis (ex: rede lenta) — cai para o gradiente
    // simples, para a partilha nunca falhar por completo.
    const gradiente = ctx.createLinearGradient(0, 0, largura, altura);
    gradiente.addColorStop(0, "#0a1f3f");
    gradiente.addColorStop(1, "#2557a0");
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, largura, altura);

    ctx.fillStyle = "#dbb84a";
    ctx.font = "600 40px sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("FAMATOUR", 80, 150);
  }

  const yIntro = 1060;
  const yNomeStart = yIntro + 100;

  ctx.fillStyle = "#f2f6fc";
  ctx.font = "500 52px sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("O meu destino ideal é...", 80, yIntro);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 96px serif";
  const linhasNome = quebrarLinhas(ctx, destino.nomeCompleto, largura - 160);
  linhasNome.forEach((linha, i) => {
    ctx.fillText(linha, 80, yNomeStart + i * 108);
  });

  const yTagline = yNomeStart + linhasNome.length * 108 + 45;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "400 50px sans-serif";
  const linhasTagline = quebrarLinhas(ctx, destino.tagline, largura - 160);
  linhasTagline.forEach((linha, i) => {
    ctx.fillText(linha, 80, yTagline + i * 62);
  });

  ctx.fillStyle = "#dbb84a";
  ctx.font = "500 32px sans-serif";
  ctx.fillText("Descobre o teu destino em famatour.pt", 80, altura - 100);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
