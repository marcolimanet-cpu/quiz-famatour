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
    pergunta: "Tens filhos? Se sim, quantos e as datas de nascimento",
    usoComercial:
      "Campanhas de família (ex: parques temáticos), ofertas por idade dos filhos",
    tipo: "texto",
  },
  {
    chave: "data_casamento",
    pergunta: "Data de casamento ou compromisso",
    usoComercial:
      "Campanhas de aniversário de casamento, sugestões de lua de mel",
    tipo: "data",
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
      { valor: "sim", etiqueta: "Sim, é a primeira vez" },
      { valor: "nao", etiqueta: "Não, já viajei com a Famatour antes" },
    ],
  },
  {
    chave: "celebra_ocasioes",
    pergunta: "Costumas celebrar ocasiões especiais em viagem?",
    usoComercial: "Sinaliza cliente propenso a pacotes de celebração/upgrade",
    tipo: "escolha",
    opcoes: [
      { valor: "sim", etiqueta: "Sim" },
      { valor: "as_vezes", etiqueta: "Às vezes" },
      { valor: "nao", etiqueta: "Não" },
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
    chave: "fidelizacao",
    // Adaptado de "Já és cliente fidelizado de alguma companhia de cruzeiros? Em que nível?"
    pergunta:
      "És membro de algum programa de fidelização de viagens (companhias aéreas, hotéis, etc.)? Em que nível?",
    usoComercial:
      'Sinal de valor de cliente alto; muda o tom da abordagem comercial de "explicar" para "poupar tempo e dar vantagem"',
    tipo: "texto",
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
