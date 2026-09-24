"use client";

import { useState } from "react";
import type { Pergunta } from "@/types/quiz";
import { ProgressBar } from "./ProgressBar";
import { TextChoiceCard } from "./TextChoiceCard";
import { ImageChoiceCard } from "./ImageChoiceCard";

interface EcraPerguntaProps {
  pergunta: Pergunta;
  indice: number;
  total: number;
  onResponder: (opcaoId: string, tempoSegundos: number) => void;
}

/** Mostra uma pergunta de cada vez, como pedido — nunca um formulário todo visível. */
export function EcraPergunta({ pergunta, indice, total, onResponder }: EcraPerguntaProps) {
  const [inicio] = useState(() => Date.now());
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | null>(null);

  function handleSelecionar(opcaoId: string) {
    if (opcaoSelecionada) return;
    setOpcaoSelecionada(opcaoId);
    // Date.now() aqui corre só num clique do utilizador, nunca durante o
    // render — é seguro apesar do aviso de pureza do React Compiler, que
    // ainda não distingue handlers de código de render nesta versão.
    // eslint-disable-next-line react-hooks/purity
    const tempoSegundos = (Date.now() - inicio) / 1000;
    // Pequena pausa para o utilizador ver o cartão "acender" antes de avançar.
    setTimeout(() => onResponder(opcaoId, tempoSegundos), 380);
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <ProgressBar atual={indice} total={total} />
      <h2 className="font-display text-2xl font-semibold leading-snug text-azul-950 sm:text-3xl">
        {pergunta.texto}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {pergunta.opcoes.map((opcao) =>
          pergunta.tipoVisual === "imagem" && opcao.imagemFundo ? (
            <ImageChoiceCard
              key={opcao.id}
              texto={opcao.texto}
              imagemFundo={opcao.imagemFundo}
              selecionado={opcaoSelecionada === opcao.id}
              onSelect={() => handleSelecionar(opcao.id)}
            />
          ) : (
            <TextChoiceCard
              key={opcao.id}
              texto={opcao.texto}
              selecionado={opcaoSelecionada === opcao.id}
              onSelect={() => handleSelecionar(opcao.id)}
            />
          )
        )}
      </div>
    </div>
  );
}
