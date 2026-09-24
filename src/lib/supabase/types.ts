import type {
  ClusterNome,
  DestinoChave,
  PontuacaoDestino,
  RespostaQuiz,
} from "@/types/quiz";

export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export type RespostaCrmGuardada = {
  chave: string;
  valor: string;
};

export type ParticipacaoRow = {
  id: string;
  criado_em: string;
  nome: string;
  email: string | null;
  telemovel: string | null;
  respostas: RespostaQuiz[];
  cluster_vencedor: ClusterNome;
  destino_vencedor: DestinoChave;
  top3: PontuacaoDestino[];
  todas_pontuacoes: PontuacaoDestino[];
  utm: UtmParams;
  partilha_id: string;
  referrer_partilha_id: string | null;
  guia_email: string | null;
  guia_aberto_completo: boolean;
  partilha_whatsapp_clicada: boolean;
  consultor_whatsapp_clicado: boolean;
  consentimento_crm: boolean;
  consentimento_crm_em: string | null;
  respostas_crm: RespostaCrmGuardada[] | null;
  webhook_enviado: boolean;
  webhook_tentativas: number;
  webhook_ultimo_erro: string | null;
  webhook_ultimo_erro_em: string | null;
};

export type ParticipacaoInsert = Omit<
  ParticipacaoRow,
  | "id"
  | "criado_em"
  | "partilha_id"
  | "guia_email"
  | "guia_aberto_completo"
  | "partilha_whatsapp_clicada"
  | "consultor_whatsapp_clicado"
  | "consentimento_crm"
  | "consentimento_crm_em"
  | "respostas_crm"
  | "webhook_enviado"
  | "webhook_tentativas"
  | "webhook_ultimo_erro"
  | "webhook_ultimo_erro_em"
> & {
  referrer_partilha_id?: string | null;
  guia_email?: string | null;
};

/**
 * Tipagem mínima do schema Supabase usada pelo cliente tipado. Mantém-se de
 * propósito pequena (só a tabela que a app usa) em vez de gerar o schema
 * completo — evita depender de `supabase gen types` neste momento inicial.
 *
 * `Relationships`, `Views` e `Functions` têm de existir (mesmo vazios) para
 * corresponder ao tipo `GenericSchema` que o @supabase/postgrest-js espera
 * — sem eles o TypeScript infere `never` em todas as queries tipadas.
 *
 * Tem de ser `type`, não `interface`: com `interface` o TypeScript não
 * consegue confirmar que isto satisfaz `GenericSchema` (verificado em
 * isolamento) e todas as queries tipadas do cliente colapsam para `never`.
 */
export type Database = {
  public: {
    Tables: {
      participacoes: {
        Row: ParticipacaoRow;
        Insert: ParticipacaoInsert;
        Update: Partial<ParticipacaoRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
