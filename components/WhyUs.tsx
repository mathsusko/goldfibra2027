import type { ReactNode } from "react";
import { Cctv, HeartPlus, Target, Wifi } from "lucide-react";

type CardProps = {
  title: string;
  description: string;
  index: string;
  icon: ReactNode;
};

function WhyUsCard({ title, description, index, icon }: CardProps) {
  return (
    <div className="w-full h-[494.94px] md:w-[calc(33.333%_-_22px)] p-4 bg-custom-gradient rounded-lg shadow-lg filter drop-shadow-md flex flex-col items-start">
      <div className="py-2 px-5 border border-white rounded-full">
        <span className="text-xs text-white">{index}</span>
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <div className="flex items-center justify-center">{icon}</div>
      </div>
      <h3 className="text-white text-xl mb-2">{title}</h3>
      <p className="text-white text-start text-xs">{description}</p>
    </div>
  );
}

export default function WhyUs() {
  return (
    <div className="flex flex-col justify-start items-center h-fit gap-10 w-full p-4 md:max-w-[1440px] mx-auto">
      <div className="inline-flex px-3 py-2 mt-10 justify-center items-center gap-2 rounded-full border-4 border-[rgba(14,28,41,0.2)] bg-[#E5E5E5]">
        <Target />
        <p>NOSSA MISSÃO</p>
      </div>
      <div className="flex flex-col gap-3 w-full h-fit justify-start items-center">
        <h2 className="text-3xl text-gradient-custom md:text-6xl text-center">
          Por que Escolher <br />
          Goldfibra?
        </h2>
        <p className="text-center font-light md:text-center md:w-[505px]">
          Benefícios projetados para proporcionar uma experiência— integrada, segura e acessível para todos os clientes.
        </p>
      </div>
      <div className="flex flex-col h-fit gap-3 justify-between md:flex-row">
        <WhyUsCard
          icon={<Wifi size={120} color="#fff" />}
          index="1"
          title="Internet de Qualidade"
          description="Atendimento imediato, suporte é agendado no instante que você liga."
        />
        <WhyUsCard
          icon={<Cctv size={120} color="#fff" />}
          index="2"
          title="Segurança 24h"
          description="A proteção dos seus dados é garantida por 24 horas por dia."
        />
        <WhyUsCard
          icon={<HeartPlus size={120} color="#fff" />}
          index="3"
          title="Suporte Exclusivo"
          description="Suporte técnico especializado sempre que precisar."
        />
      </div>
    </div>
  );
}
