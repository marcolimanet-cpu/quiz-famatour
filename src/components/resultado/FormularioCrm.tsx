"use client";

import { useState, type FormEvent } from "react";
import { PERGUNTAS_CRM } from "@/data/perguntas-crm";
import { submeterCrm } from "@/app/actions";
import { registarEvento } from "@/lib/analytics";
import type { RespostaCrmGuardada } from "@/lib/supabase/types";

interface FormularioCrmProps {
  participacaoId: string;
}

const PERGUNTA_CONSENTIMENTO = PERGUNTAS_CRM.find((p) => p.tipo === "consentimento")!;
const PERGUNTAS_CONTEUDO = PERGUNTAS_CRM.filter((p) => p.tipo !== "consentimento");

const classesCampo =
  "w-full rounded-xl border-2 border-azul-100 px-4 py-3 text-base text-azul-950 outline-none transition-colors focus:border-dourado-400";

type Estado = "idle" | "a-enviar" | "enviado" | "erro";

export function FormularioCrm({ participacaoId }: FormularioCrmProps) {
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [consentimento, setConsentimento] = useState(false);
  const [estado, setEstado] = useState<Estado>("idle");
  const [visivel, setVisivel] = useState(true);

  function atualizarCampo(chave: string, valor: string) {
    setRespostas((anterior) => ({ ...anterior, [chave]: valor }));
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setEstado("a-enviar");

    const respostasPreenchidas: RespostaCrmGuardada[] = Object.entries(respostas)
      .filter(([, valor]) => valor.trim() !== "")
      .map(([chave, valor]) => ({ chave, valor }));

    const resultado = await submeterCrm({
      participacaoId,
      respostas: respostasPreenchidas,
      consentimento,
    });

    if (resultado.ok) {
      setEstado("enviado");
      registarEvento("crm_submetido", { consentimento });
    } else {
      setEstado("erro");
    }
  }

  if (!visivel) return null;

  if (estado === "enviado") {
    return (
      <div className="rounded-3xl bg-azul-50 p-6 text-center sm:p-8">
        <p className="font-display text-xl font-semibold text-azul-950">
          Obrigado! Já temos tudo para te preparar surpresas na tua viagem.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-6 rounded-3xl border-2 border-azul-100 p-6 sm:p-8"
    >
      <div>
        <h3 className="font-display text-2xl font-semibold text-azul-950">
          Ajuda-nos a preparar surpresas para a tua viagem
        </h3>
        <p className="mt-2 text-azul-700">
          Totalmente opcional — mas quanto mais soubermos, melhor te
          conseguimos surpreender. Demora menos de um minuto.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {PERGUNTAS_CONTEUDO.map((pergunta) => (
          <div key={pergunta.chave} className="flex flex-col gap-1.5">
            <label htmlFor={pergunta.chave} className="text-sm font-medium text-azul-800">
              {pergunta.pergunta}
            </label>
            {pergunta.tipo === "escolha" ? (
              <select
                id={pergunta.chave}
                className={classesCampo}
                value={respostas[pergunta.chave] ?? ""}
                onChange={(e) => atualizarCampo(pergunta.chave, e.target.value)}
              >
                <option value="">Preferes não dizer</option>
                {pergunta.opcoes?.map((opcao) => (
                  <option key={opcao.valor} value={opcao.valor}>
                    {opcao.etiqueta}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={pergunta.chave}
                type={pergunta.tipo === "data" ? "date" : "text"}
                className={classesCampo}
                value={respostas[pergunta.chave] ?? ""}
                onChange={(e) => atualizarCampo(pergunta.chave, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <label className="flex items-start gap-3 rounded-xl bg-azul-50 p-4 text-sm text-azul-900">
        <input
          type="checkbox"
          checked={consentimento}
          onChange={(e) => setConsentimento(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-dourado-500"
        />
        <span>{PERGUNTA_CONSENTIMENTO.pergunta}</span>
      </label>

      {estado === "erro" && (
        <p className="text-sm font-medium text-red-600">
          Não foi possível guardar. Tenta outra vez.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={estado === "a-enviar"}
          className="flex-1 rounded-full bg-azul-900 px-6 py-3.5 font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-azul-800 active:scale-[0.98] disabled:opacity-60"
        >
          {estado === "a-enviar" ? "A guardar..." : "Enviar"}
        </button>
        <button
          type="button"
          onClick={() => setVisivel(false)}
          className="rounded-full px-6 py-3.5 font-medium text-azul-500 transition-colors hover:text-azul-700"
        >
          Agora não, obrigado
        </button>
      </div>
    </form>
  );
}
