"use client";

/**
 * Gera o cartão de partilha (formato vertical tipo Stories, 1080x1920) em
 * canvas, para download. V1 desenhado com gradiente + texto (sem depender
 * de fotografia licenciada ainda em falta) — fácil de evoluir para compor a
 * foto real do destino por cima assim que as imagens finais da Famatour
 * estiverem disponíveis (ver README).
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

export function gerarCartaoPartilha(nomeDestino: string, tagline: string): string {
  const largura = 1080;
  const altura = 1920;

  const canvas = document.createElement("canvas");
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const gradiente = ctx.createLinearGradient(0, 0, largura, altura);
  gradiente.addColorStop(0, "#0a1f3f");
  gradiente.addColorStop(1, "#2557a0");
  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, largura, altura);

  ctx.beginPath();
  ctx.arc(largura * 0.85, altura * 0.18, 260, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(201, 162, 39, 0.25)";
  ctx.fill();

  ctx.fillStyle = "#dbb84a";
  ctx.font = "600 40px sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("FAMATOUR", 80, 150);

  ctx.fillStyle = "#f2f6fc";
  ctx.font = "500 34px sans-serif";
  ctx.fillText("O meu destino ideal é...", 80, 900);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 96px serif";
  const linhasNome = quebrarLinhas(ctx, nomeDestino, largura - 160);
  linhasNome.forEach((linha, i) => {
    ctx.fillText(linha, 80, 1000 + i * 108);
  });

  const yTagline = 1000 + linhasNome.length * 108 + 70;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "400 38px sans-serif";
  const linhasTagline = quebrarLinhas(ctx, tagline, largura - 160);
  linhasTagline.forEach((linha, i) => {
    ctx.fillText(linha, 80, yTagline + i * 50);
  });

  ctx.fillStyle = "#dbb84a";
  ctx.font = "500 32px sans-serif";
  ctx.fillText("Descobre o teu destino em famatour.pt", 80, altura - 100);

  return canvas.toDataURL("image/png");
}
