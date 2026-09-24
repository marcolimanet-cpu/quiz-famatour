/**
 * Tipos partilhados do motor do quiz "Descobre o teu Destino".
 *
 * Fonte de verdade: Quiz_Famatour_Destinos.xlsx (folhas Destinos, Matriz_Pontos,
 * Perguntas_CRM). Ver src/data/*.ts para os dados extraídos desse ficheiro.
 *
 * Nota: tudo aqui é `type`, nunca `interface`. Estes tipos alimentam a
 * tabela `participacoes` do Supabase (ver lib/supabase/types.ts) e, com
 * `interface`, o TypeScript não consegue confirmar que o schema satisfaz
 * `GenericSchema` do @supabase/postgrest-js — todas as queries tipadas
 * colapsam silenciosamente para `never`. Verificado em isolamento.
 */

export type ClusterNome =
  | "Praia & Relax"
  | "Mediterrâneo"
  | "Natureza Extrema"
  | "Exótico";

/** Chave técnica do destino, igual à coluna "Destino (chave)" da folha Destinos. */
export type DestinoChave =
  | "dubai-eau"
  | "grecia"
  | "italia"
  | "mediterraneo"
  | "noruega"
  | "islandia"
  | "caraibas"
  | "cabo-verde"
  | "tailandia"
  | "japao"
  | "maldivas"
  | "canarias"
  | "madeira"
  | "acores"
  | "turquia"
  | "marrocos"
  | "rep-dominicana"
  | "brasil"
  | "amazonia"
  | "alasca";

export type Destino = {
  chave: DestinoChave;
  nomeCompleto: string;
  cluster: ClusterNome;
  tagline: string;
};

export type TipoVisual = "texto" | "imagem";

export type OpcaoPergunta = {
  /** Igual à coluna Option_ID da Matriz_Pontos (ex: "Q1_A"). */
  id: string;
  texto: string;
  /**
   * Só usado quando a pergunta é tipoVisual "imagem": caminho da imagem de
   * fundo do cartão. Ex: "/images/quiz/q2-praia.jpg".
   */
  imagemFundo?: string;
  /** Pontos que esta opção atribui a cada destino. Chaves omitidas valem 0. */
  pontos: Partial<Record<DestinoChave, number>>;
};

export type Pergunta = {
  /** Igual à coluna Pergunta/Option_ID prefixo da Matriz_Pontos (ex: "Q1"). */
  id: string;
  fase: 1 | 2;
  /** "Todos" nas perguntas da Fase 1; o nome do cluster nas da Fase 2. */
  cluster: "Todos" | ClusterNome;
  texto: string;
  /**
   * texto | imagem — decide se usa TextChoiceCard ou ImageChoiceCard.
   * Classificação inicial minha, a validar/ajustar por ti após veres o
   * primeiro protótipo com os dois tipos de cartão (pedido explícito teu).
   */
  tipoVisual: TipoVisual;
  opcoes: OpcaoPergunta[];
};

/** Uma resposta dada pelo utilizador a uma pergunta pontuável (Fase 1 ou 2). */
export type RespostaQuiz = {
  perguntaId: string;
  opcaoId: string;
  /** Tempo em segundos entre a pergunta aparecer e a resposta ser escolhida. */
  tempoRespostaSegundos: number;
};

export type PontuacaoDestino = {
  chave: DestinoChave;
  pontos: number;
};

export type ResultadoQuiz = {
  clusterVencedor: ClusterNome;
  top3: PontuacaoDestino[];
  /** Pontuação de todos os destinos, ordenada, para auditoria/depuração. */
  todasPontuacoes: PontuacaoDestino[];
};

export type TipoCampoCrm = "data" | "texto" | "escolha" | "consentimento";

export type OpcaoCrm = {
  valor: string;
  etiqueta: string;
};

export type PerguntaCrm = {
  chave: string;
  pergunta: string;
  usoComercial: string;
  tipo: TipoCampoCrm;
  opcoes?: OpcaoCrm[];
  obrigatoria?: boolean;
};

/**
 * Conteúdo estático do mini-guia por destino. Virá da futura folha
 * "Conteudo_Guia" do Excel — por agora é texto placeholder (ver
 * src/data/conteudo-guia.ts e o README).
 */
export type ConteudoGuiaDestino = {
  destinoChave: DestinoChave;
  /** Exatamente 3 experiências imperdíveis. */
  experiencias: [string, string, string];
  melhorAltura: string;
  /** true enquanto o texto for placeholder, não conteúdo real da Famatour. */
  placeholder: boolean;
};

export type PerfilDica = "familia" | "luxo" | "tranquilizadora" | "padrao";
