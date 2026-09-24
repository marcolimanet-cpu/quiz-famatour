"use client";

import { useState, type FormEvent } from "react";

export interface DadosContacto {
  nome: string;
  email: string;
  telemovel: string;
}

interface EcraContactoProps {
  onSubmeter: (dados: DadosContacto) => void;
  aEnviar: boolean;
  erro: string | null;
}

const classesInput =
  "w-full rounded-xl border-2 border-azul-100 px-4 py-3 text-base text-azul-950 outline-none transition-colors focus:border-dourado-400";

export function EcraContacto({ onSubmeter, aEnviar, erro }: EcraContactoProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telemovel, setTelemovel] = useState("");
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent) {
    evento.preventDefault();

    if (!nome.trim()) {
      setErroValidacao("Diz-nos o teu nome.");
      return;
    }
    if (!email.trim() && !telemovel.trim()) {
      setErroValidacao("Deixa-nos pelo menos um contacto: email ou telemóvel.");
      return;
    }

    setErroValidacao(null);
    onSubmeter({ nome: nome.trim(), email: email.trim(), telemovel: telemovel.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold text-azul-950 sm:text-3xl">
          Já sabemos quase tudo sobre ti...
        </h2>
        <p className="mt-2 text-azul-700">
          Só falta dizeres-nos quem és, para revelarmos o teu destino.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="O teu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={classesInput}
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="O teu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={classesInput}
          autoComplete="email"
        />
        <input
          type="tel"
          placeholder="O teu telemóvel (opcional se deres email)"
          value={telemovel}
          onChange={(e) => setTelemovel(e.target.value)}
          className={classesInput}
          autoComplete="tel"
        />
      </div>

      {(erroValidacao || erro) && (
        <p className="text-sm font-medium text-red-600">{erroValidacao ?? erro}</p>
      )}

      <button
        type="submit"
        disabled={aEnviar}
        className="rounded-full bg-azul-900 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-azul-900/20 transition-transform hover:scale-[1.02] hover:bg-azul-800 active:scale-[0.98] disabled:opacity-60"
      >
        {aEnviar ? "A revelar o teu destino..." : "Revelar o meu destino"}
      </button>
    </form>
  );
}
