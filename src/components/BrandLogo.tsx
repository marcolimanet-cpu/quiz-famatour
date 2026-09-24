interface BrandLogoProps {
  variante?: "azul" | "branco";
  className?: string;
}

/**
 * Wordmark provisório da Famatour (texto estilizado), enquanto o ficheiro
 * real do logótipo (SVG/PNG, cor e versão a branco) não é adicionado a
 * /public/images/brand/ — ver README. Não é uma reprodução do ícone da
 * marca, só do nome, para não arriscar uma cópia imprecisa do símbolo.
 */
export function BrandLogo({ variante = "azul", className = "" }: BrandLogoProps) {
  const cor = variante === "branco" ? "text-white" : "text-azul-900";

  return (
    <span className={`font-display text-xl font-bold lowercase tracking-tight ${cor} ${className}`}>
      famatour
    </span>
  );
}
