import { QuizExperience } from "@/components/quiz/QuizExperience";
import type { UtmParams } from "@/lib/supabase/types";

function primeiroValor(valor: string | string[] | undefined): string | undefined {
  return Array.isArray(valor) ? valor[0] : valor;
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;

  const utm: UtmParams = {
    utm_source: primeiroValor(params.utm_source),
    utm_medium: primeiroValor(params.utm_medium),
    utm_campaign: primeiroValor(params.utm_campaign),
    utm_content: primeiroValor(params.utm_content),
    utm_term: primeiroValor(params.utm_term),
  };

  const referrerPartilhaId = primeiroValor(params.ref) ?? null;

  return (
    <main className="flex flex-1 flex-col bg-white">
      <QuizExperience utm={utm} referrerPartilhaId={referrerPartilhaId} />
    </main>
  );
}
