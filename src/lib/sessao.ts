/**
 * Chaves de sessionStorage partilhadas entre o fim do quiz (QuizExperience)
 * e a página de resultado (ResultadoClient). Guardam só o nome e o perfil
 * de dica do próprio participante, no browser dele — nunca vão para a base
 * de dados por esta via nem são visíveis a quem abre o link partilhado
 * noutro dispositivo (é precisamente por isso que ficam em sessionStorage e
 * não na resposta pública da API).
 */
export const CHAVE_SESSAO_NOME = "famatour_nome_participacao";
export const CHAVE_SESSAO_PERFIL_DICA = "famatour_perfil_dica";
