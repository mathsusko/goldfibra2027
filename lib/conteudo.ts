/** Conteúdo da home. A redação completa e a origem de cada texto estão em docs/redacao.md. */

export const WHATSAPP = "https://wa.me/554320181778";
export const TELEFONE = "(43) 2018-1778";
export const TELEFONE_LINK = "tel:+554320181778";
export const INSTAGRAM = "https://www.instagram.com/goldfibrainternet/";
export const FACEBOOK = "https://facebook.com/goldfibrainternet";
export const ENDERECO = ["Rua Eurilemos, 461 – Centro", "Arapongas – PR, 86700-015"];
export const MAPA =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Rua Eurilemos, 461, Centro, Arapongas - PR, 86700-015");
export const CNPJ = "28.048.928/0001-65";

export const zap = (texto: string) => `${WHATSAPP}?text=${encodeURIComponent(texto)}`;

export type Plano = {
  id: string;
  nome: string;
  preco: string;
  precoEmDia: string;
  texto: string[];
  beneficios: string[];
  selo?: string;
  imagem: string;
};

export const PLANOS: Plano[] = [
  {
    id: "600",
    nome: "600 Mega",
    preco: "99,90",
    precoEmDia: "79,90",
    texto: [
      "Plano básico para você que só precisa de uma conexão estável.",
      "Fibra óptica até dentro de casa, com Wi-Fi 6G e instalação grátis.",
    ],
    beneficios: ["WI-FI 6G", "INSTALAÇÃO GRÁTIS", "100% FIBRA"],
    imagem: "/media/plano-600-largo.webp",
  },
  {
    id: "800",
    nome: "800 Mega",
    preco: "119,90",
    precoEmDia: "99,90",
    texto: [
      "Para você que quer alta performance em seus jogos.",
      "Inclui 1 IP fixo e roteador Wi-Fi 6G em comodato.",
    ],
    beneficios: ["1 IP FIXO", "WI-FI 6G", "100% FIBRA"],
    selo: "PLANO GAMER",
    imagem: "/media/plano-800-largo.webp",
  },
  {
    id: "1000",
    nome: "1 Giga",
    preco: "139,90",
    precoEmDia: "119,90",
    texto: [
      "Para uma família grande, com vários aparelhos conectados em casa.",
      "Velocidade de sobra para assistir, jogar e trabalhar ao mesmo tempo.",
    ],
    beneficios: ["WI-FI 6G", "INSTALAÇÃO GRÁTIS", "100% FIBRA"],
    imagem: "/media/plano-1giga-largo.webp",
  },
];

export const MENU = [
  {
    rotulo: "Planos",
    itens: PLANOS.map((p) => ({
      titulo: p.nome,
      desc: `R$${p.preco}/mês · R$${p.precoEmDia} pagando em dia`,
      href: `#plano-${p.id}`,
    })),
  },
  {
    rotulo: "Para quem",
    itens: [
      { titulo: "Residencial", desc: "Estabilidade para a casa toda", href: zap("Olá! Quero internet para minha casa.") },
      { titulo: "Gamer", desc: "Ping baixo do primeiro ao último round", href: zap("Olá! Quero o plano gamer.") },
      { titulo: "Empresa", desc: "Sem interrupções no expediente", href: zap("Olá! Quero internet para minha empresa.") },
      { titulo: "Condomínio", desc: "Toda a rede padronizada com a gente", href: zap("Olá! Quero internet para meu condomínio.") },
    ],
  },
  {
    rotulo: "Suporte",
    itens: [
      { titulo: "2ª via da fatura", desc: "Enviamos por e-mail ou no WhatsApp", href: zap("Olá! Preciso da 2ª via da fatura.") },
      { titulo: "Suporte técnico", desc: "Especialistas sempre que precisar", href: zap("Olá! Preciso de suporte técnico.") },
      { titulo: "Financeiro", desc: "Pagamentos, planos e contrato", href: zap("Olá! Quero falar com o financeiro.") },
      { titulo: "Mudança de endereço", desc: "Leve a Goldfibra com você", href: zap("Olá! Vou mudar de endereço.") },
    ],
  },
];
