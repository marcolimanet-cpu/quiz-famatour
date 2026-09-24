"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PERGUNTAS_FASE_1, getPerguntasFase2 } from "@/data/perguntas";
import { decidirClusterVencedor } from "@/lib/scoring";
import { derivarPerfilDica } from "@/lib/mini-guia";
import { registarEvento } from "@/lib/analytics";
import { criarParticipacao } from "@/app/actions";
import type { RespostaQuiz } from "@/types/quiz";
import type { UtmParams } from "@/lib/supabase/types";
import { EcraInicial } from "./EcraInicial";
import { EcraPergunta } from "./EcraPergunta";
import { EcraContacto, type DadosContacto } from "./EcraContacto";
import { CHAVE_SESSAO_NOME, CHAVE_SESSAO_PERFIL_DICA } from "@/lib/sessao";

type Passo = "inicio" | "fase1" | "fase2" | "contacto";

interface QuizExperienceProps {
  utm: UtmParams;
  referrerPartilhaId: string | null;
}

export function QuizExperience({ utm, referrerPartilhaId }: QuizExperienceProps) {
  const router = useRouter();

  const [passo, setPasso] = useState<Passo>("inicio");
  const [respostasFase1, setRespostasFase1] = useState<RespostaQuiz[]>([]);
  const [respostasFase2, setRespostasFase2] = useState<RespostaQuiz[]>([]);
  const [indiceFase1, setIndiceFase1] = useState(0);
  const [indiceFase2, setIndiceFase2] = useState(0);
  const [aEnviar, setAEnviar] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const perguntasFase2 = useMemo(() => {
    if (respostasFase1.length < PERGUNTAS_FASE_1.length) return [];
    const cluster = decidirClusterVencedor(respostasFase1);
    return getPerguntasFase2(cluster);
  }, [respostasFase1]);

  // Todos os clusters têm exatamente 2 perguntas de afinação na Fase 2
  // (ver Matriz_Pontos) — por isso o total é conhecido desde o início,
  // mesmo antes do cluster estar decidido, o que mantém a barra de
  // progresso estável.
  const totalPerguntas = PERGUNTAS_FASE_1.length + 2;

  function comecar() {
    registarEvento("quiz_iniciado");
    setPasso("fase1");
  }

  function responderFase1(opcaoId: string, tempoSegundos: number) {
    const pergunta = PERGUNTAS_FASE_1[indiceFase1];
    const novasRespostas = [
      ...respostasFase1,
      { perguntaId: pergunta.id, opcaoId, tempoRespostaSegundos: tempoSegundos },
    ];
    setRespostasFase1(novasRespostas);

    if (indiceFase1 + 1 < PERGUNTAS_FASE_1.length) {
      setIndiceFase1(indiceFase1 + 1);
      return;
    }

    registarEvento("fase1_concluida");
    setPasso("fase2");
  }

  function responderFase2(opcaoId: string, tempoSegundos: number) {
    const pergunta = perguntasFase2[indiceFase2];
    const novasRespostas = [
      ...respostasFase2,
      { perguntaId: pergunta.id, opcaoId, tempoRespostaSegundos: tempoSegundos },
    ];
    setRespostasFase2(novasRespostas);

    if (indiceFase2 + 1 < perguntasFase2.length) {
      setIndiceFase2(indiceFase2 + 1);
      return;
    }

    setPasso("contacto");
  }

  async function submeter(dados: DadosContacto) {
    setAEnviar(true);
    setErroEnvio(null);

    const todasRespostas = [...respostasFase1, ...respostasFase2];

    const resultado = await criarParticipacao({
      nome: dados.nome,
      email: dados.email,
      telemovel: dados.telemovel,
      respostas: todasRespostas,
      utm,
      referrerPartilhaId,
    });

    if (!resultado.ok) {
      setAEnviar(false);
      setErroEnvio(resultado.erro);
      return;
    }

    try {
      sessionStorage.setItem(CHAVE_SESSAO_NOME, dados.nome);
      sessionStorage.setItem(CHAVE_SESSAO_PERFIL_DICA, derivarPerfilDica(todasRespostas));
    } catch {
      // sessionStorage pode falhar em privado/incógnito — só perde a personalização.
    }

    registarEvento("resultado_revelado");
    router.push(`/resultado/${resultado.id}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-12">
      {passo === "inicio" && <EcraInicial onComecar={comecar} />}

      {passo === "fase1" && (
        <EcraPergunta
          key={PERGUNTAS_FASE_1[indiceFase1].id}
          pergunta={PERGUNTAS_FASE_1[indiceFase1]}
          indice={indiceFase1 + 1}
          total={totalPerguntas}
          onResponder={responderFase1}
        />
      )}

      {passo === "fase2" && perguntasFase2[indiceFase2] && (
        <EcraPergunta
          key={perguntasFase2[indiceFase2].id}
          pergunta={perguntasFase2[indiceFase2]}
          indice={PERGUNTAS_FASE_1.length + indiceFase2 + 1}
          total={totalPerguntas}
          onResponder={responderFase2}
        />
      )}

      {passo === "contacto" && (
        <EcraContacto onSubmeter={submeter} aEnviar={aEnviar} erro={erroEnvio} />
      )}
    </div>
  );
}
