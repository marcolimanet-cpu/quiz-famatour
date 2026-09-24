import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Cliente Supabase para uso exclusivo no servidor (Server Actions e Route
 * Handlers). Usa a service role key, que ignora RLS — por isso este ficheiro
 * nunca pode ser importado por um Client Component. A app não usa a chave
 * anon em lado nenhum: não há acesso à base de dados a partir do browser.
 */
export function supabaseServidor() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY em falta nas variáveis de ambiente."
    );
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
