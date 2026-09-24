# Logótipo Famatour

Ainda não tenho o ficheiro real do logótipo (só vi a imagem colada na
conversa, que não fica acessível como ficheiro neste ambiente). Por agora a
app usa um wordmark de texto ("famatour" em minúsculas, a negrito) como
substituto — ver `src/components/BrandLogo.tsx`.

Antes do lançamento, coloca aqui os ficheiros reais e troca o componente
`BrandLogo` para usar `<Image>` com eles:

- `logo-azul.svg` — versão a azul, para fundos claros
- `logo-branco.svg` — versão a branco, para fundos escuros/imagens
- `marca-icon.svg` — só o símbolo (os dois "D" entrelaçados), para o favicon

Formato SVG de preferência (escala sem perda em qualquer tamanho de ecrã).
Se só tiveres PNG, serve na mesma — description dos tamanhos recomendados:
mínimo 800px de largura para a versão horizontal.

A cor de azul usada em todo o site (`--color-azul-900` em
`src/app/globals.css`) foi escolhida a olho a partir da imagem do logótipo
que me mostraste — é uma aproximação, não o código de cor oficial da marca.
Se tiveres o HEX exato do manual de marca, diz-me e ajusto.
