export const PHONE_DISPLAY = "(43) 2018-1778";
export const PHONE_TEL = "tel:+554320181778";
export const WHATSAPP_URL = "https://wa.me/554320181778";
export const FACEBOOK_URL = "https://facebook.com/goldfibrainternet";
export const INSTAGRAM_URL = "https://www.instagram.com/goldfibrainternet/";

export const ADDRESS_LINE_1 = "Rua Eurilemos, 461 – Centro";
export const ADDRESS_LINE_2 = "Arapongas – PR, 86700-015";
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Rua Eurilemos, 461, Centro, Arapongas - PR, 86700-015");

/** Vídeo do card "Fibra pura" (gerado no Higgsfield). Sem ele, aparece só o pôster. */
export const REEL_VIDEO: string | null = "/media/reel.mp4";
export const REEL_POSTER = "/media/reel-poster.webp";

export const CNPJ = "28.048.928/0001-65";

export type Plano = {
  id: string;
  nome: string;
  preco: string;
  precoEmDia: string;
  descricao: string;
  beneficios: string[];
  destaque?: string;
  imagem: string;
  /** Foto 16:9 da seção de tela cheia do plano. */
  imagemLarga: string;
};

export const PLANOS: Plano[] = [
  {
    id: "600",
    nome: "600 Mega",
    preco: "99,90",
    precoEmDia: "79,90",
    descricao: "Plano básico para você que só precisa de uma conexão estável.",
    beneficios: ["Wi-Fi 6G", "Instalação grátis", "Equip. em comodato", "100% fibra"],
    imagem: "/media/plano-600.webp",
    imagemLarga: "/media/plano-600-largo.webp",
  },
  {
    id: "800",
    nome: "800 Mega",
    preco: "119,90",
    precoEmDia: "99,90",
    descricao: "Para você que quer alta performance em seus jogos.",
    beneficios: ["1 IP fixo", "Wi-Fi 6G", "Instalação grátis", "Equip. em comodato", "100% fibra"],
    destaque: "Plano gamer",
    imagem: "/media/plano-800.webp",
    imagemLarga: "/media/plano-800-largo.webp",
  },
  {
    id: "1000",
    nome: "1 Giga",
    preco: "139,90",
    precoEmDia: "119,90",
    descricao: "Para uma família grande, com vários aparelhos conectados em casa.",
    beneficios: ["Wi-Fi 6G", "Instalação grátis", "Equip. em comodato", "100% fibra"],
    imagem: "/media/plano-1giga.webp",
    imagemLarga: "/media/plano-1giga-largo.webp",
  },
];

export const SEGMENTOS = [
  { nome: "Residencial", frase: "Estabilidade para a casa toda", imagem: "/media/plano-600.webp" },
  { nome: "Gamer", frase: "Ping baixo do primeiro ao último round", imagem: "/media/plano-800.webp" },
  { nome: "Empresa", frase: "Sem interrupções no expediente", imagem: "/media/empresa.webp" },
  { nome: "Condomínio", frase: "Toda a rede padronizada com a gente", imagem: "/media/condominio.webp" },
];

export const DIFERENCIAIS = [
  {
    titulo: "Internet de qualidade",
    texto: "Atendimento imediato: o suporte é agendado no instante em que você liga.",
  },
  {
    titulo: "Segurança 24h",
    texto: "A proteção dos seus dados é garantida 24 horas por dia.",
  },
  {
    titulo: "Suporte exclusivo",
    texto: "Suporte técnico especializado sempre que você precisar.",
  },
];

export const FAQ = [
  {
    pergunta: "A internet está disponível na minha cidade, bairro ou rua?",
    resposta:
      "Atendemos Arapongas e região. Chame a gente no WhatsApp com o seu endereço e confirmamos a cobertura na hora.",
  },
  {
    pergunta: "A velocidade da internet é garantida?",
    resposta:
      "A velocidade contratada é garantida dentro das condições ideais de uso. Cabeamento, número de aparelhos conectados e uso da rede local podem influenciar. Se notar variações, fale com o suporte para uma análise detalhada.",
  },
  {
    pergunta: "Como faço para alterar minha velocidade?",
    resposta:
      "Acesse o portal do cliente ou fale com o suporte. Conforme a sua região e o seu plano, ajustamos a conexão para o que você precisa.",
  },
  {
    pergunta: "Como emitir a 2ª via da fatura?",
    resposta:
      "Pelo portal do cliente ou pelo WhatsApp: enviamos a fatura por e-mail ou direto na conversa.",
  },
  {
    pergunta: "Como contrato a Goldfibra?",
    resposta: "Fale com o nosso atendimento pelo WhatsApp ou pelo telefone (43) 2018-1778.",
  },
  {
    pergunta: "Posso levar a Goldfibra para o meu novo endereço?",
    resposta:
      "Sim. Fale com o suporte para agendar a mudança e manter o serviço funcionando no novo endereço.",
  },
  {
    pergunta: "Minha instalação está demorando. O que pode ser?",
    resposta:
      "Ajustes técnicos, disponibilidade de equipamentos ou o clima podem atrasar a instalação. Fale com o suporte para saber o status atualizado.",
  },
  {
    pergunta: "O que é velocidade de download e de upload?",
    resposta:
      "Download é a rapidez com que você recebe dados (assistir vídeos, baixar arquivos). Upload é a rapidez com que você envia dados (mandar arquivos, fazer videochamadas).",
  },
  {
    pergunta: "Minha fibra óptica foi rompida. O que eu faço?",
    resposta:
      "Fale imediatamente com o suporte técnico. Nossa equipe agenda o reparo o mais rápido possível.",
  },
  {
    pergunta: "Qual o prazo de instalação?",
    resposta:
      "Normalmente a instalação acontece em até 7 dias úteis após a confirmação do agendamento, conforme a sua localidade e a agenda dos técnicos.",
  },
];
