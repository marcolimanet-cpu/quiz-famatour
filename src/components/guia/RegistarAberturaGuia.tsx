"use client";

import { useEffect, useRef } from "react";
import { registarSinal } from "@/lib/sinais";

interface RegistarAberturaGuiaProps {
  participacaoId: string | null;
}

/**
 * Regista que o participante abriu o guia completo (sem fricção nenhuma —
 * dispara sozinho ao montar). Só age quando a página vem com `?p=`, ou
 * seja, quando foi aberta a partir do botão do ecrã de resultado; alguém a
 * navegar diretamente para /guia/[destino] não gera este sinal, porque não
 * está ligado a nenhuma participação.
 */
export function RegistarAberturaGuia({ participacaoId }: RegistarAberturaGuiaProps) {
  const jaRegistado = useRef(false);

  useEffect(() => {
    if (!participacaoId || jaRegistado.current) return;
    jaRegistado.current = true;
    registarSinal(participacaoId, "guia_aberto_completo");
  }, [participacaoId]);

  return null;
}
