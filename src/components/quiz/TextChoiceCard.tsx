"use client";

interface TextChoiceCardProps {
  texto: string;
  selecionado: boolean;
  onSelect: () => void;
}

/**
 * Cartão de resposta só-texto, para perguntas mais abstratas (ex: "Como
 * gostas de gastar o teu dinheiro em férias?"). Grande e tocável — sem
 * dropdowns, como pedido.
 */
export function TextChoiceCard({ texto, selecionado, onSelect }: TextChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selecionado}
      className={`w-full rounded-2xl border-2 px-6 py-5 text-left text-lg font-medium transition-all duration-200 active:scale-[0.98] ${
        selecionado
          ? "animacao-acender border-dourado-500 bg-dourado-100 text-azul-950"
          : "border-azul-100 bg-white text-azul-900 hover:border-dourado-400 hover:bg-azul-50"
      }`}
    >
      {texto}
    </button>
  );
}
