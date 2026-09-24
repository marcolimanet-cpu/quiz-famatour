import { NextResponse, type NextRequest } from "next/server";
import { supabaseServidor } from "@/lib/supabase/server";

/**
 * Regista sinais de comportamento sem fricção para o utilizador: guia
 * completo aberto, partilha WhatsApp clicada, consultor WhatsApp clicado.
 * Pensado para ser chamado com `fetch(..., { keepalive: true })`, que
 * sobrevive mesmo que a página seja fechada logo a seguir ao clique.
 */
const SINAIS_VALIDOS = [
  "guia_aberto_completo",
  "partilha_whatsapp_clicada",
  "consultor_whatsapp_clicado",
] as const;

type Sinal = (typeof SINAIS_VALIDOS)[number];

export async function POST(request: NextRequest) {
  let body: { participacaoId?: string; sinal?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { participacaoId, sinal } = body;

  if (!participacaoId || !SINAIS_VALIDOS.includes(sinal as Sinal)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Atualização explícita por chave (em vez de `{ [sinal]: true }`) para o
  // Supabase conseguir tipar o update — uma chave computada genérica não
  // corresponde a nenhuma coluna concreta da tabela.
  const atualizacoes: Record<Sinal, { [K in Sinal]?: true }> = {
    guia_aberto_completo: { guia_aberto_completo: true },
    partilha_whatsapp_clicada: { partilha_whatsapp_clicada: true },
    consultor_whatsapp_clicado: { consultor_whatsapp_clicado: true },
  };

  const supabase = supabaseServidor();
  const { error } = await supabase
    .from("participacoes")
    .update(atualizacoes[sinal as Sinal])
    .eq("id", participacaoId);

  if (error) {
    console.error(`[sinais] falha ao gravar "${sinal}":`, error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
