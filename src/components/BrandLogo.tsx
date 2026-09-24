import Image from "next/image";

interface BrandLogoProps {
  variante?: "azul" | "branco";
  className?: string;
}

/**
 * Logótipo real da Famatour (extraído de famatour.pt), com fundo
 * transparente. A versão "branco" é uma recoloração fiel ao traço original
 * (mesmo desenho, só a cor muda), para usar sobre fundos escuros onde a
 * versão azul não teria contraste.
 */
export function BrandLogo({ variante = "azul", className = "h-6 w-auto" }: BrandLogoProps) {
  const src =
    variante === "branco"
      ? "/images/brand/logo-branco.png"
      : "/images/brand/logo-azul.png";

  return (
    <Image
      src={src}
      alt="Famatour"
      width={685}
      height={123}
      priority
      className={className}
    />
  );
}
