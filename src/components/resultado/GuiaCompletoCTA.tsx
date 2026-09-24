interface GuiaCompletoCTAProps {
  participacaoId: string;
  destinoChave: string;
}

/**
 * Acesso direto ao guia completo — sem pedir nada, porque o email já foi
 * capturado antes do resultado (ecrã de contacto). Abre em nova aba para
 * não perder o progresso no ecrã de resultado (ex: formulário CRM a meio).
 * O mesmo guia é também enviado por email automaticamente (ver
 * src/app/actions.ts, criarParticipacao) para quem preferir ler mais tarde.
 */
export function GuiaCompletoCTA({ participacaoId, destinoChave }: GuiaCompletoCTAProps) {
  const href = `/guia/${destinoChave}?p=${participacaoId}`;

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full rounded-xl bg-dourado-500 px-6 py-4 text-center font-semibold text-azul-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Descarrega o teu guia completo
      </a>
      <p className="text-sm text-azul-600">
        Também o enviámos para o teu email, para leres com calma mais tarde.
      </p>
    </div>
  );
}
