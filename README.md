# Descobre o teu Destino — Famatour

Quiz gamificado (tipo BuzzFeed) que revela o destino de férias ideal do
cliente e recolhe dados para marketing personalizado da Famatour.

Stack: **Next.js 16 (App Router) + TypeScript + Tailwind CSS + Supabase**,
alojado na **Vercel**.

## Como correr localmente

```bash
npm install
cp .env.example .env.local   # preenche as variáveis, ver abaixo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Sem `SUPABASE_URL` e
`SUPABASE_SERVICE_ROLE_KEY` válidos o quiz corre até ao ecrã de contacto mas
falha ao gravar a participação (erro tratado, não crasha) — precisas de um
projeto Supabase real para ver o ecrã de resultado.

```bash
npm run build   # build de produção + verificação de tipos
npm run lint    # eslint
```

## Configurar a base de dados (Supabase)

1. Cria um projeto em [supabase.com](https://supabase.com).
2. No SQL Editor, corre o conteúdo de `supabase/schema.sql` — cria a tabela
   `participacoes` com tudo o que a app precisa.
3. Copia o URL do projeto e a **service role key** (Project Settings → API)
   para `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` no `.env.local`.

A app só acede à base de dados a partir do servidor (Server Actions e Route
Handlers) com a service role key — nunca há acesso à BD a partir do browser,
por isso não há RLS por policies a configurar nem chave anon em lado nenhum.

## Variáveis de ambiente

Ver `.env.example` para a lista completa e comentada. Resumo:

| Variável | Para quê |
|---|---|
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Base de dados (server-only) |
| `NEXT_PUBLIC_SITE_URL` | Base dos links partilhados e do payload do webhook |
| `AUTOMATION_WEBHOOK_URL` | Webhook do Make.com (CRM/automação) |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | Analytics |
| `NEXT_PUBLIC_WHATSAPP_CONSULTOR_NUMERO` | Nº WhatsApp do consultor (formato internacional, sem `+`) |

## Fonte de verdade dos dados: o Excel

Todas as perguntas, opções e pontos vêm de `Quiz_Famatour_Destinos.xlsx`
(folhas `Destinos` e `Matriz_Pontos`), extraídos 1:1 para:

- `src/data/destinos.ts` — os 20 destinos
- `src/data/perguntas.ts` — as 12 perguntas (4 da Fase 1 + 2×4 da Fase 2, uma
  por cluster) com as suas opções e pontos por destino
- `src/data/perguntas-crm.ts` — as perguntas pós-resultado (não pontuam)

**Não editei nenhum ponto da matriz.** Se precisares de ajustar pesos, edita
diretamente `src/data/perguntas.ts` — está isolado dos componentes, como
pedido.

`src/data/conteudo-guia.ts` vem de um segundo ficheiro fonte,
`Guia_Destinos_Famatour.docx` (as 3 experiências, info prática, mala,
gastronomia, compras, cultura/etiqueta e dicionário de cada destino) — é
conteúdo real, não placeholder. Para atualizar, pede um novo `.docx` com a
mesma estrutura (título por destino em Heading 1, secções nos parágrafos
"a negrito", duas tabelas por destino) e eu extraio outra vez.

### Adaptação de texto (confirmada contigo)

3 perguntas da folha `Perguntas_CRM` usavam linguagem específica de
cruzeiros ("viagem de cruzeiro", "companhia de cruzeiros") e uma referia
"CruiseLovers" em vez de "Famatour". Foram adaptadas para linguagem
genérica de viagens em `src/data/perguntas-crm.ts` (a finalidade comercial
de cada pergunta manteve-se igual — só a palavra mudou). Ver o comentário no
topo desse ficheiro para o antes/depois exato.

## Identidade visual

O logótipo e a cor de azul (`#123572`, exata — extraída por pixel do
ficheiro real em famatour.pt) vêm do site oficial da Famatour:

- `public/images/brand/logo-azul.png` / `logo-branco.png` — lockup horizontal
  (ícone + "famatour"), fundo transparente
- `public/images/brand/marca-icon-azul.png` / `marca-icon-branco.png` — só o
  símbolo, para usos quadrados
- `src/components/BrandLogo.tsx` — componente que os usa (`variante="azul"`
  ou `"branco"` consoante o fundo)
- `src/app/icon.png`, `apple-icon.png`, `favicon.ico` — gerados a partir do
  símbolo

O dourado (`--color-dourado-*` em `globals.css`) não existe no site atual da
Famatour — é um acento que tinhas pedido explicitamente no briefing para dar
destaque a CTAs e à animação de seleção. Se preferires alinhar 100% com o
site (sem dourado), é só trocar essas variáveis.

## Lógica do jogo

`src/lib/scoring.ts` é o motor de pontuação (função pura, sem dependências
de UI ou de rede):

- **Fase 1** (4 perguntas gerais) decide o **cluster** vencedor — soma os
  pontos de todos os destinos de cada cluster e escolhe o maior.
- **Fase 2** mostra só as 2 perguntas de afinação do cluster vencedor.
- O **resultado final** é a soma de Fase 1 + Fase 2, ordenada, com top 3.
- **Desempate**: função `desempatar()` isolada (baralha aleatoriamente os
  empatados) — decisão de negócio em aberto, fácil de trocar por uma regra
  fixa mais tarde sem tocar no resto do motor.

Validado contra a folha "Simulador" do Excel (mesmo exemplo, mesmo
resultado: Maldivas 10, Rep. Dominicana 8, top 3 consistente).

O resultado é **sempre recalculado no servidor** a partir das respostas
cruas (`src/app/actions.ts`) — nunca confiamos num resultado vindo do
cliente, mesmo sendo um quiz de marketing sem grande incentivo a fazer
batota.

## RGPD

- O checkbox de consentimento CRM (`src/data/perguntas-crm.ts`, campo
  `consentimento`) está sempre desmarcado por defeito.
- As respostas da secção CRM só são gravadas se o consentimento vier a
  `true` — ver `submeterCrm` em `src/app/actions.ts`.
- A data/hora do consentimento é gravada em `consentimento_crm_em`.
- O acesso ao resultado do quiz nunca depende deste consentimento.

## Integração com automação (Make.com)

`src/lib/services/automation.ts` é o único sítio que sabe falar com a
ferramenta de automação externa — um POST JSON para
`AUTOMATION_WEBHOOK_URL`. Para trocar de ferramenta (HubSpot, Zapier,
outra), só este ficheiro muda. Dois eventos distintos, pelo mesmo webhook
(o Make.com decide o que fazer com cada um a partir do campo `evento`):

- **`resultado_calculado`** — disparado sempre que o resultado é calculado
  (`criarParticipacao`), sem depender de consentimento CRM. É transacional:
  entrega o link do guia completo (`/guia/[destino]`) ao email/telemóvel
  que a pessoa acabou de dar precisamente para isso — não é "comunicações e
  ofertas personalizadas", por isso não precisa do checkbox de consentimento.
  Corre depois da resposta ser enviada ao browser (`after()` do Next.js),
  para não atrasar a revelação do resultado.
- **`crm_consentido`** — disparado só com consentimento CRM explícito
  (`submeterCrm`), com as respostas da secção CRM e os sinais de
  comportamento. Este sim alimenta marketing personalizado.

Falhas do evento `crm_consentido` ficam registadas em `webhook_enviado` /
`webhook_ultimo_erro` na tabela `participacoes`, para poderes reprocessar
manualmente. Falhas do `resultado_calculado` só vão para o log (Vercel
Runtime Logs) — é um envio best-effort complementar ao link que já fica
sempre disponível em `/resultado/[id]`, por isso não tem o mesmo peso de
"perdi um lead" que o `crm_consentido` tem.

## Sinais de comportamento

Gravados sem pedir nada ao utilizador, via `POST /api/sinais`
(`fetch(..., { keepalive: true })`, sobrevive ao fecho da página):

- Tempo de resposta por pergunta (`tempoRespostaSegundos` em cada resposta)
- Se o guia completo foi aberto (`/guia/[destino]`, a partir do botão
  "Descarrega o teu guia completo" ou do link enviado por email)
- Se o botão de partilha WhatsApp foi clicado
- Se o botão "falar com consultor" foi clicado (no resultado ou no guia)

## O guia completo (/guia/[destino])

Página pública e estática, com o mesmo conteúdo para toda a gente que
recebeu aquele destino — não tem nada específico do participante. O botão
no ecrã de resultado abre `/guia/[destino]?p={participacaoId}`; o `?p=` só
serve para registar o sinal "guia aberto" (`guia_aberto_completo`) daquela
participação — nunca é usado para mostrar dados dela na página, por isso
não há problema de privacidade em o link circular.

## Privacidade do link de resultado partilhado

O link `/resultado/[id]` é feito para ser partilhado publicamente
(WhatsApp, Instagram). `src/lib/participacoes.ts` só devolve o subconjunto
seguro dos dados (destino, top 3) — nunca nome, email, telemóvel ou
respostas do participante original. A saudação personalizada ("Marco, o teu
destino é...") só aparece no browser da própria pessoa, via `sessionStorage`
(nunca chega ao servidor nem a quem abre o link partilhado).

## O que falta antes do lançamento

- **Imagens finais dos destinos.** Todas as imagens em
  `/public/images/destinos/{chave}/` e `/public/images/quiz/` e
  `/public/images/hero/` são placeholders gerados por código (gradiente +
  nome), claramente marcados. Substitui por fotografia licenciada ou da
  Famatour antes do lançamento — mesma estrutura de pastas, `1.jpg` é a
  imagem principal.
- **`tipoVisual` das perguntas.** Classificação inicial minha
  (texto/imagem) em `src/data/perguntas.ts` — valida depois de veres o
  protótipo com os dois tipos de cartão.
- **Coluna "Alinhado com catálogo Famatour"** da folha Destinos — validação
  de negócio, não fica representada no código.
- **Nº de WhatsApp do consultor** e **URL do webhook Make.com** — configurar
  via variáveis de ambiente antes de ativar em produção. Sem
  `AUTOMATION_WEBHOOK_URL`, o guia continua acessível pelo botão no
  resultado, só o envio automático por email fica em falta.
- **Verificação de cliente existente** — não implementada nesta fase
  (decisão tua: a base de clientes atual não está facilmente consultável).
  A estrutura de dados já tem `referrer_partilha_id` preparado para
  funcionalidades futuras de partilha em grupo.

## Estrutura do projeto

```
src/
  types/quiz.ts              tipos partilhados (usar `type`, nunca `interface`
                              — ver nota no topo do ficheiro)
  data/                       dados extraídos do Excel (fonte de verdade)
  lib/scoring.ts              motor de pontuação
  lib/mini-guia.ts            lógica da dica personalizada do mini-guia
  lib/supabase/               cliente Supabase + tipos da BD
  lib/services/automation.ts  webhook de CRM/automação
  lib/sinais.ts                sinais de comportamento (cliente)
  lib/analytics.ts             GA4 + Meta Pixel (cliente)
  app/actions.ts               Server Actions (criar participação, CRM)
  app/api/sinais/               Route Handler dos sinais de comportamento
  app/page.tsx                  landing + quiz (SPA cliente)
  app/resultado/[id]/           página de resultado pública/partilhável
  app/guia/[destino]/           guia completo do destino (público, sem dados do participante)
  components/quiz/              ecrãs e cartões do quiz
  components/resultado/         mini-guia (prévia), partilha, CRM, CTA consultor
  components/guia/              conteúdo do guia completo, botão "Guardar em PDF"
supabase/schema.sql            schema da tabela participacoes
```
