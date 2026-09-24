-- Schema Supabase para "Descobre o teu Destino" (Famatour)
-- Corre isto uma vez no SQL Editor do teu projeto Supabase.

create extension if not exists "pgcrypto";

create table if not exists public.participacoes (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),

  -- Identificação do participante (pedida antes do resultado final)
  nome text not null,
  email text,
  telemovel text,

  -- Respostas pontuáveis (Fase 1 + Fase 2) e resultado calculado
  respostas jsonb not null default '[]'::jsonb,
  cluster_vencedor text not null,
  destino_vencedor text not null,
  top3 jsonb not null default '[]'::jsonb,
  todas_pontuacoes jsonb not null default '[]'::jsonb,

  -- Origem da participação (parâmetros UTM da URL, se existirem)
  utm jsonb default '{}'::jsonb,

  -- Identificador único para o link de partilha (permite medir partilhas ->
  -- novas participações no futuro; ver referrer_partilha_id abaixo)
  partilha_id text not null unique default encode(gen_random_bytes(8), 'hex'),
  -- Se esta participação chegou a partir do link partilhado por outra
  -- pessoa, guarda aqui o partilha_id de origem. Preparado desde já para a
  -- funcionalidade futura de comparar/votar destinos em grupo, sem a
  -- construir agora.
  referrer_partilha_id text,

  -- Segundo momento de captação: email pedido no CTA do mini-guia completo
  guia_email text,

  -- Sinais de comportamento (sem fricção para o utilizador)
  guia_aberto_completo boolean not null default false,
  partilha_whatsapp_clicada boolean not null default false,
  consultor_whatsapp_clicado boolean not null default false,

  -- Secção CRM (RGPD): só preenchida se consentimento_crm = true
  consentimento_crm boolean not null default false,
  consentimento_crm_em timestamptz,
  respostas_crm jsonb,

  -- Estado do envio para a ferramenta de automação (Make.com)
  webhook_enviado boolean not null default false,
  webhook_tentativas integer not null default 0,
  webhook_ultimo_erro text,
  webhook_ultimo_erro_em timestamptz
);

create index if not exists participacoes_criado_em_idx on public.participacoes (criado_em desc);
create index if not exists participacoes_destino_vencedor_idx on public.participacoes (destino_vencedor);
create index if not exists participacoes_partilha_id_idx on public.participacoes (partilha_id);

-- A aplicação só acede a esta tabela a partir do servidor (Server Actions /
-- Route Handlers) com a service role key, que ignora RLS. Ativamos RLS sem
-- nenhuma política como proteção extra: nenhum pedido feito com a chave
-- pública (anon) — que esta app não usa, mas podias vir a usar noutro
-- contexto — consegue ler ou escrever nesta tabela.
alter table public.participacoes enable row level security;

comment on table public.participacoes is
  'Uma linha por participação completa no quiz "Descobre o teu Destino". Não expor via chave anon — só acedida server-side com a service role key.';
