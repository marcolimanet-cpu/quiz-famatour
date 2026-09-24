interface ProgressBarProps {
  atual: number;
  total: number;
}

export function ProgressBar({ atual, total }: ProgressBarProps) {
  const percentagem = Math.min(100, Math.round((atual / total) * 100));

  return (
    <div className="w-full">
      <div className="h-2 w-full overflow-hidden rounded-full bg-azul-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-azul-700 to-dourado-500 transition-all duration-500 ease-out"
          style={{ width: `${percentagem}%` }}
        />
      </div>
      <p className="mt-2 text-sm font-medium text-azul-700">
        Pergunta {atual} de {total}
      </p>
    </div>
  );
}
