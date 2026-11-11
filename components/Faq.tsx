"use client";

import * as Collapsible from "@radix-ui/react-collapsible";

type FaqItem = { pergunta: string; resposta: string };

const colunaEsquerda: FaqItem[] = [
  {
    pergunta: "A internet está disponível em minha cidade/bairro/rua?",
    resposta:
      "A velocidade fornecida é garantida dentro das condições ideais de uso. Fatores como a qualidade do cabeamento, o número de dispositivos conectados e a utilização da rede local podem impactar a velocidade. Se você observar variações, entre em contato com nosso suporte para uma análise detalhada.",
  },
  {
    pergunta: "A velocidade da internet é garantida?",
    resposta:
      "A velocidade fornecida é garantida dentro das condições ideais de uso. Fatores como a qualidade do cabeamento, o número de dispositivos conectados e a utilização da rede local podem impactar a velocidade. Se você observar variações, entre em contato com nosso suporte para uma análise detalhada.",
  },
  {
    pergunta: "Como faço para alterar minha velocidade?",
    resposta:
      "Para alterar sua velocidade, você pode acessar sua conta no portal de cliente ou entrar em contato com o nosso suporte. Dependendo da sua região e plano, podemos realizar ajustes na sua conexão para atender às suas necessidades.",
  },
  {
    pergunta: "Como emitir a 2ª via de fatura?",
    resposta:
      "Você pode emitir a 2ª via de fatura através do nosso portal de cliente ou entrar em contato com nosso suporte para que enviemos a fatura por e-mail ou WhatsApp.",
  },
  {
    pergunta: "Como posso contratar a Goldfibra?",
    resposta:
      "Para contratar nossos serviços, basta acessar nosso site e preencher o formulário de solicitação de instalação, ou entrar em contato com nosso atendimento via WhatsApp, e-mail ou telefone.",
  },
];

const colunaDireita: FaqItem[] = [
  {
    pergunta: "É possível levar a Goldfibra para o meu novo endereço?",
    resposta:
      "Sim, é possível realizar a transferência do seu serviço para um novo endereço. Entre em contato com nosso suporte para agendar a mudança e garantir a continuidade do seu serviço no novo local.",
  },
  {
    pergunta: "Minha instalação está demorando, o que pode estar acontecendo?",
    resposta:
      "A instalação pode demorar devido a diversos fatores, como a necessidade de realizar ajustes técnicos, falta de disponibilidade de equipamentos ou situações externas, como o tempo. Verifique com nosso suporte para um status atualizado sobre o seu processo de instalação.",
  },
  {
    pergunta: "O que é velocidade de download e upload?",
    resposta:
      "A velocidade de download refere-se à rapidez com que você recebe dados da internet (como assistir vídeos ou baixar arquivos), enquanto a velocidade de upload é a rapidez com que você envia dados para a internet (como enviar arquivos ou realizar videoconferências).",
  },
  {
    pergunta: "Minha fibra óptica foi rompida: o que eu faço?",
    resposta:
      "Se sua fibra ótica foi rompida, entre em contato imediatamente com nosso suporte técnico. A nossa equipe fará o possível para resolver o problema rapidamente, realizando os reparos necessários.",
  },
  {
    pergunta: "Qual o prazo de instalação?",
    resposta:
      "O prazo de instalação pode variar de acordo com a sua localidade e a disponibilidade de nossos técnicos. Normalmente, a instalação é realizada em até 7 dias úteis após a confirmação do agendamento. Para mais detalhes, entre em contato com nosso atendimento.",
  },
];

function FaqColuna({ itens }: { itens: FaqItem[] }) {
  return (
    <div className="grid grid-cols-1 w-full h-fit">
      {itens.map(({ pergunta, resposta }) => (
        <Collapsible.Root key={pergunta}>
          <div className="text-white overflow-hidden w-full">
            <Collapsible.Trigger className="w-full p-6 h-full text-sm flex justify-between items-start border border-slate-50 cursor-pointer">
              <span className="text-start">{pergunta}</span>
              <span className="text-slate-50">+</span>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <div className="p-6 bg-[#2A3C52]">
                <p>{resposta}</p>
              </div>
            </Collapsible.Content>
          </div>
        </Collapsible.Root>
      ))}
    </div>
  );
}

export default function Faq() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full">
      <FaqColuna itens={colunaEsquerda} />
      <FaqColuna itens={colunaDireita} />
    </div>
  );
}
