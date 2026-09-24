import type { ConteudoGuiaDestino } from "@/types/quiz";

interface SecaoProps {
  titulo: string;
  children: React.ReactNode;
}

function Secao({ titulo, children }: SecaoProps) {
  return (
    <section className="flex flex-col gap-3 border-t border-azul-100 pt-8">
      <h2 className="font-display text-2xl font-semibold text-azul-950">{titulo}</h2>
      {children}
    </section>
  );
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-dourado-600">{label}</p>
      <p className="mt-1 text-azul-900">{valor}</p>
    </div>
  );
}

function Lista({ itens }: { itens: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {itens.map((item) => (
        <li key={item} className="flex gap-3 text-azul-900">
          <span className="text-dourado-500">✦</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

interface GuiaCompletoConteudoProps {
  conteudo: ConteudoGuiaDestino;
}

export function GuiaCompletoConteudo({ conteudo }: GuiaCompletoConteudoProps) {
  const { resumo, infoEssencial, gastronomia, compras, comoCircular, culturaEtiqueta, dicionario } =
    conteudo;

  return (
    <div className="flex flex-col gap-8">
      <Secao titulo="O destino em poucos segundos">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="O que o torna especial" valor={resumo.especial} />
          <Campo label="Para quem é mais indicado" valor={resumo.paraQuem} />
          <Campo label="Ritmo da viagem" valor={resumo.ritmo} />
          <Campo label="Melhor altura para visitar" valor={resumo.melhorAltura} />
          <Campo label="Dias recomendados" valor={resumo.diasRecomendados} />
        </div>
      </Secao>

      <Secao titulo="Informações essenciais">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Capital / cidade principal" valor={infoEssencial.capital} />
          <Campo label="Moeda" valor={infoEssencial.moeda} />
          <Campo label="Idioma" valor={infoEssencial.idioma} />
          <Campo label="Fuso horário" valor={infoEssencial.fusoHorario} />
          <Campo label="Eletricidade" valor={infoEssencial.eletricidade} />
          <Campo label="Clima (na época típica de viagem)" valor={infoEssencial.clima} />
        </div>
      </Secao>

      <Secao titulo="O que levar na mala">
        <Lista itens={conteudo.mala} />
      </Secao>

      <Secao titulo="O que não podes perder">
        <Lista itens={conteudo.imperdiveis} />
      </Secao>

      <Secao titulo="Gastronomia">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Pratos a experimentar" valor={gastronomia.pratos} />
          <Campo label="Bebida típica" valor={gastronomia.bebida} />
          <Campo label="Sobremesa a não perder" valor={gastronomia.sobremesa} />
          <Campo label="Hábito local à mesa" valor={gastronomia.habitoMesa} />
        </div>
      </Secao>

      <Secao titulo="Compras e recordações">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Produtos típicos" valor={compras.produtos} />
          <Campo label="Onde comprar" valor={compras.ondeComprar} />
          <Campo label="Regatear" valor={compras.regatear} />
          <Campo label="Atenção na alfândega" valor={compras.alfandega} />
        </div>
      </Secao>

      <Secao titulo="Como circular">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Transporte disponível" valor={comoCircular.transporte} />
          <Campo label="A pé" valor={comoCircular.aPe} />
        </div>
      </Secao>

      <Secao titulo="Cultura e etiqueta local">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Como cumprimentar" valor={culturaEtiqueta.cumprimentar} />
          <Campo label="Vestuário" valor={culturaEtiqueta.vestuario} />
          <Campo label="Locais religiosos" valor={culturaEtiqueta.locaisReligiosos} />
          <Campo label="Gestos e comportamento" valor={culturaEtiqueta.gestos} />
          <Campo label="Álcool" valor={culturaEtiqueta.alcool} />
        </div>
      </Secao>

      {dicionario && (
        <Secao titulo={`Pequeno dicionário (${dicionario.idioma})`}>
          <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {dicionario.frases.map((frase) => (
              <div key={frase.chave} className="flex justify-between gap-4 border-b border-azul-50 py-1.5">
                <span className="text-azul-700">{frase.chave}</span>
                <span className="font-medium text-azul-950">{frase.valor}</span>
              </div>
            ))}
          </div>
        </Secao>
      )}
    </div>
  );
}
