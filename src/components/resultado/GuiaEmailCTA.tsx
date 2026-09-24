"use client";

import { useState, type FormEvent } from "react";
import { guardarEmailGuia } from "@/app/actions";

interface GuiaEmailCTAProps {
  participacaoId: string;
}

export function GuiaEmailCTA({ participacaoId }: GuiaEmailCTAProps) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "a-enviar" | "enviado" | "erro">("idle");

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    if (!email.trim()) return;

    setEstado("a-enviar");
    const resultado = await guardarEmailGuia(participacaoId, email);
    setEstado(resultado.ok ? "enviado" : "erro");
  }

  if (estado === "enviado") {
    return (
      <p className="rounded-2xl bg-dourado-100 p-4 text-center font-medium text-azul-950">
        Combinado! O teu guia completo chega ao email em breve.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        placeholder="O teu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-xl border-2 border-azul-100 px-4 py-3 text-base text-azul-950 outline-none transition-colors focus:border-dourado-400"
      />
      <button
        type="submit"
        disabled={estado === "a-enviar"}
        className="rounded-xl bg-dourado-500 px-6 py-3 font-semibold text-azul-950 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
      >
        Recebe este guia completo no teu email
      </button>
      {estado === "erro" && (
        <p className="text-sm text-red-600 sm:col-span-2">
          Não foi possível guardar o teu email. Tenta outra vez.
        </p>
      )}
    </form>
  );
}
