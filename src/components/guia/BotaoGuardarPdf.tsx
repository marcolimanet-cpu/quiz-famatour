"use client";

/**
 * "Guardar em PDF" sem gerar nada no servidor: usa a função nativa de
 * imprimir do browser (todos os browsers modernos oferecem "Guardar como
 * PDF" no diálogo de impressão). Simples e fiável no Vercel — ver
 * @media print em globals.css para o resultado ficar bem formatado.
 */
export function BotaoGuardarPdf() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden rounded-full border-2 border-azul-200 px-6 py-3 text-sm font-semibold text-azul-900 transition-colors hover:border-dourado-400 hover:bg-azul-50"
    >
      Guardar em PDF
    </button>
  );
}
