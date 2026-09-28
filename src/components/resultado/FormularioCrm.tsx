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

/** Quantos campos de idade mostrar, consoante a resposta à quantidade de filhos ("3+" mostra 3). */
function numeroFilhos(valor: string | undefined): number {
  if (valor === "1") return 1;
  if (valor === "2") return 2;
  if (valor === "3+") return 3;
  return 0;
}

/** "celebra_ocasioes" guarda as opções marcadas como lista separada por vírgulas num único valor. */
function opcoesSelecionadas(valor: string | undefined): string[] {
  if (!valor) return [];
  return valor.split(",").filter(Boolean);
}

export function FormularioCrm({ participacaoId }: FormularioCrmProps) {
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [consentimento, setConsentimento] = useState(false);
  const [estado, setEstado] = useState<Estado>("idle");
  const [visivel, setVisivel] = useState(true);

  function atualizarCampo(chave: string, valor: string) {
    setRespostas((anterior) => ({ ...anterior, [chave]: valor }));
  }

  // Ao reduzir (ou limpar) a quantidade de filhos, descarta as idades que
  // deixaram de ter campo visível — para não as submeter às escondidas.
  function atualizarQuantidadeFilhos(valor: string) {
    setRespostas((anterior) => {
      const seguinte: Record<string, string> = { ...anterior, filhos: valor };
      const total = numeroFilhos(valor);
      for (let i = total + 1; i <= 3; i++) {
        delete seguinte[`filhos_idade_${i}`];
      }
      return seguinte;
    });
  }

  // Escolha múltipla com uma opção exclusiva ("Preferes não dizer"): marcá-la
  // desmarca as restantes, e marcar qualquer outra desmarca-a a ela — nunca
  // fazem sentido em simultâneo. Ao desmarcar "Outra", limpa o texto livre.
  function alternarOcasiao(valorOpcao: string) {
    setRespostas((anterior) => {
      const atuais = opcoesSelecionadas(anterior.celebra_ocasioes);
      let seguintes: string[];

      if (valorOpcao === "prefere_nao_dizer") {
        seguintes = atuais.includes("prefere_nao_dizer") ? [] : ["prefere_nao_dizer"];
      } else if (atuais.includes(valorOpcao)) {
        seguintes = atuais.filter((v) => v !== valorOpcao);
      } else {
        seguintes = [...atuais.filter((v) => v !== "prefere_nao_dizer"), valorOpcao];
      }

      const seguinte: Record<string, string> = {
        ...anterior,
        celebra_ocasioes: seguintes.join(","),
      };
      if (!seguintes.includes("outra")) delete seguinte.celebra_ocasioes_outra;
      return seguinte;
    });
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
        {PERGUNTAS_CONTEUDO.map((pergunta) => {
          if (pergunta.chave === "primeira_viagem") {
            return (
              <div key={pergunta.chave} className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-azul-800">{pergunta.pergunta}</span>
                <div className="flex gap-6">
                  {pergunta.opcoes?.map((opcao) => (
                    <label
                      key={opcao.valor}
                      className="flex items-center gap-2 text-azul-950"
                    >
                      <input
                        type="radio"
                        name={pergunta.chave}
                        value={opcao.valor}
                        checked={respostas[pergunta.chave] === opcao.valor}
                        onChange={(e) => atualizarCampo(pergunta.chave, e.target.value)}
                        className="h-4 w-4 accent-dourado-500"
                      />
                      {opcao.etiqueta}
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          if (pergunta.chave === "celebra_ocasioes") {
            const selecionadas = opcoesSelecionadas(respostas.celebra_ocasioes);
            return (
              <div key={pergunta.chave} className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-azul-800">{pergunta.pergunta}</span>
                <div className="flex flex-col gap-2">
                  {pergunta.opcoes?.map((opcao) => (
                    <label
                      key={opcao.valor}
                      className="flex items-center gap-2 text-azul-950"
                    >
                      <input
                        type="checkbox"
                        checked={selecionadas.includes(opcao.valor)}
                        onChange={() => alternarOcasiao(opcao.valor)}
                        className="h-5 w-5 shrink-0 accent-dourado-500"
                      />
                      {opcao.etiqueta}
                    </label>
                  ))}
                </div>
                {selecionadas.includes("outra") && (
                  <input
                    type="text"
                    placeholder="Qual?"
                    aria-label="Qual outra ocasião"
                    className={`${classesCampo} mt-1`}
                    value={respostas.celebra_ocasioes_outra ?? ""}
                    onChange={(e) =>
                      atualizarCampo("celebra_ocasioes_outra", e.target.value)
                    }
                  />
                )}
              </div>
            );
          }

          if (pergunta.chave === "filhos") {
            const totalFilhos = numeroFilhos(respostas.filhos);
            return (
              <div key={pergunta.chave} className="flex flex-col gap-1.5">
                <label htmlFor={pergunta.chave} className="text-sm font-medium text-azul-800">
                  {pergunta.pergunta}
                </label>
                <select
                  id={pergunta.chave}
                  className={classesCampo}
                  value={respostas[pergunta.chave] ?? ""}
                  onChange={(e) => atualizarQuantidadeFilhos(e.target.value)}
                >
                  <option value="">Preferes não dizer</option>
                  {pergunta.opcoes?.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                      {opcao.etiqueta}
                    </option>
                  ))}
                </select>
                {totalFilhos > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    {Array.from({ length: totalFilhos }).map((_, i) => (
                      <input
                        key={i}
                        type="number"
                        min={0}
                        inputMode="numeric"
                        placeholder={`Idade do ${i + 1}º filho`}
                        aria-label={`Idade do ${i + 1}º filho`}
                        className={classesCampo}
                        value={respostas[`filhos_idade_${i + 1}`] ?? ""}
                        onChange={(e) =>
                          atualizarCampo(`filhos_idade_${i + 1}`, e.target.value)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
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
          );
        })}
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
