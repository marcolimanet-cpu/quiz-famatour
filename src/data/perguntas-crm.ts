import type { PerguntaCrm } from "@/types/quiz";

/**
 * Perguntas pós-resultado da folha "Perguntas_CRM" de
 * Quiz_Famatour_Destinos.xlsx. NÃO contam para a pontuação — só são
 * mostradas depois do destino já ter sido revelado, e só são guardadas se o
 * campo `consentimento` (última entrada, obrigatória) for aceite.
 *
 * Adaptação feita (confirmada contigo): a folha original tinha 3 perguntas
 * com linguagem específica de cruzeiros ("viagem de cruzeiro", "companhia
 * de cruzeiros") e uma referência a "CruiseLovers" em vez de "Famatour".
 * Como a app é para agência de viagens generalista, o texto foi adaptado
 * para linguagem de viagens em geral — a finalidade comercial de cada
 * pergunta (coluna "Para que serve depois" da folha) mantém-se exatamente
 * igual, só a palavra "cruzeiro" foi generalizada para "viagem".
 */
export const PERGUNTAS_CRM: PerguntaCrm[] = [
  {
    chave: "data_nascimento",
    pergunta: "Data de nascimento",
    usoComercial:
      "Postal/áudio de aniversário automático, mesmo sem reserva",
    tipo: "data",
  },
  {
    chave: "filhos",
    pergunta: "Tens filhos? Quantos e que idade têm?",
    usoComercial:
      "Campanhas de família (ex: parques temáticos), ofertas por idade dos filhos",
    tipo: "escolha",
    opcoes: [
      { valor: "0", etiqueta: "0 (zero)" },
      { valor: "1", etiqueta: "1 (um)" },
      { valor: "2", etiqueta: "2 (dois)" },
      { valor: "3+", etiqueta: "3 ou mais" },
    ],
  },
  {
    chave: "animais_estimacao",
    pergunta: "Tens animais de estimação? Quais?",
    usoComercial: "Comunicação mais próxima; não usar para venda direta, é rapport",
    tipo: "texto",
  },
  {
    chave: "restricoes_alimentares",
    pergunta: "Tens restrições alimentares ou alergias?",
    usoComercial: "Preparação da viagem, evita fricção no destino",
    tipo: "texto",
  },
  {
    chave: "primeira_viagem",
    // Adaptado de "É a tua primeira viagem de cruzeiro?"
    pergunta: "É a tua primeira viagem connosco?",
    usoComercial: "Ajusta tom da comunicação (educar vs. upsell direto)",
    tipo: "escolha",
    opcoes: [
      { valor: "sim", etiqueta: "Sim" },
      { valor: "nao", etiqueta: "Não" },
    ],
  },
  {
    chave: "celebra_ocasioes",
    pergunta: "Vais celebrar alguma ocasião especial nesta viagem?",
    usoComercial: "Sinaliza cliente propenso a pacotes de celebração/upgrade",
    tipo: "escolha",
    opcoes: [
      { valor: "aniversario", etiqueta: "Aniversário" },
      { valor: "aniversario_casamento", etiqueta: "Aniversário de casamento ou namoro" },
      { valor: "lua_de_mel", etiqueta: "Lua de mel" },
      { valor: "dia_dos_namorados", etiqueta: "Dia dos Namorados" },
      { valor: "natal", etiqueta: "Natal" },
      { valor: "fim_de_ano", etiqueta: "Fim de ano" },
      { valor: "outra", etiqueta: "Outra" },
      { valor: "prefere_nao_dizer", etiqueta: "Preferes não dizer" },
    ],
  },
  {
    chave: "cidade",
    pergunta: "Em que cidade vives?",
    usoComercial:
      "Define aeroporto de partida mais próximo (viabilidade/preço real das propostas) e permite convites a eventos locais da Famatour",
    tipo: "texto",
  },
  {
    chave: "com_quem_viajas",
    pergunta: "Com quem viajas normalmente?",
    usoComercial:
      "Personaliza sugestões de destino/pacote (romântico, familiar, grupo)",
    tipo: "escolha",
    opcoes: [
      { valor: "sozinho", etiqueta: "Sozinho" },
      { valor: "casal", etiqueta: "Casal" },
      { valor: "familia_criancas", etiqueta: "Família com crianças" },
      { valor: "grupo_amigos", etiqueta: "Grupo de amigos" },
    ],
  },
  {
    chave: "destinos_sonho",
    pergunta: "Que destinos sonhas conhecer?",
    usoComercial:
      "Lista de desejos para campanhas direcionadas e alertas de promoção por destino",
    tipo: "escolha",
    opcoes: [
      { valor: "caraibas", etiqueta: "Caraíbas" },
      { valor: "fiordes", etiqueta: "Fiordes" },
      { valor: "mediterraneo", etiqueta: "Mediterrâneo" },
      { valor: "alasca", etiqueta: "Alasca" },
      { valor: "medio_oriente_egito", etiqueta: "Médio Oriente e Egito" },
      { valor: "asia", etiqueta: "Ásia" },
      { valor: "volta_ao_mundo", etiqueta: "Volta ao mundo" },
      { valor: "outro", etiqueta: "Outro" },
      { valor: "prefere_nao_dizer", etiqueta: "Preferes não dizer" },
    ],
  },
  {
    chave: "cruzeiros_feitos",
    pergunta: "Quantos cruzeiros já fizeste?",
    usoComercial:
      "Sinal de experiência com cruzeiros; ajusta tom da comunicação (educar vs. upsell direto)",
    tipo: "escolha",
    opcoes: [
      { valor: "0", etiqueta: "0" },
      { valor: "1_a_3", etiqueta: "1 a 3" },
      { valor: "4_a_10", etiqueta: "4 a 10" },
      { valor: "mais_de_10", etiqueta: "Mais de 10" },
    ],
  },
  {
    chave: "canal_conhecimento",
    // Adaptado de "Como conheceste a Famatour/CruiseLovers?"
    pergunta: "Como conheceste a Famatour?",
    usoComercial:
      "Identifica os canais de marketing que trazem os leads mais valiosos, para orientar onde investir",
    tipo: "escolha",
    opcoes: [
      { valor: "instagram", etiqueta: "Instagram" },
      { valor: "facebook", etiqueta: "Facebook" },
      { valor: "google", etiqueta: "Pesquisa no Google" },
      { valor: "recomendacao", etiqueta: "Recomendação de um amigo/familiar" },
      { valor: "ja_cliente", etiqueta: "Já sou cliente Famatour" },
      { valor: "outro", etiqueta: "Outro" },
    ],
  },
  {
    chave: "canal_preferido",
    pergunta: "Preferes receber novidades por email, WhatsApp ou ambos?",
    usoComercial: "Define canal de contacto preferido",
    tipo: "escolha",
    opcoes: [
      { valor: "email", etiqueta: "Email" },
      { valor: "whatsapp", etiqueta: "WhatsApp" },
      { valor: "ambos", etiqueta: "Ambos" },
    ],
  },
  {
    chave: "consentimento",
    pergunta:
      "Aceito receber comunicações e ofertas personalizadas da Famatour com base nas minhas respostas",
    usoComercial: "Consentimento RGPD — obrigatório, checkbox separado",
    tipo: "consentimento",
    obrigatoria: true,
  },
];
