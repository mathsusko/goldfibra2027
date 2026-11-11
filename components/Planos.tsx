import { BadgeCheck, Gamepad2 } from "lucide-react";
import { WHATSAPP_URL } from "./constants";

type PlanoProps = {
  plano: string;
  preco: string;
  descricao: string;
  beneficios: string[];
};

function PlanoCard({ plano, preco, descricao, beneficios }: PlanoProps) {
  return (
    <div className="w-full md:max-w-[360px] p-6 bg-white rounded-lg shadow-lg flex gap-4 flex-col items-start">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex gap-3 items-center">
            <BadgeCheck className="text-gradient-custom-two" />
            <span className="text-xl text-gradient-custom-two font-medium">{plano}</span>
          </div>
          <div className="flex gap-1 items-end">
            <span className="text-4xl font-sf font-bold text-gradient-custom">{`R$${preco}`}</span>
            <span className="text-gradient-custom-two text-sm pb-1">/mês</span>
          </div>
        </div>
        <p className="text-gradient-custom-two text-base">{descricao}</p>
      </div>
      <button className="w-full py-3 bg-custom-gradient text-white rounded-lg transition duration-300">
        <a className="text-base" href={WHATSAPP_URL} target="_blank">
          Contratar planos
        </a>
      </button>
      <div className="mb-6 w-full mt-2">
        <ul className="space-y-3 p-3">
          {beneficios.map((beneficio) => (
            <li key={beneficio} className="flex items-center text-gradient-custom-two text-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-custom-gradient mr-2" />
              <span>{beneficio}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PlanoDestaqueCard({
  plano,
  preco,
  descricao,
  beneficios,
  planoType,
}: PlanoProps & { planoType: string }) {
  return (
    <div className="w-full md:max-w-[405px] p-6 bg-custom-gradient rounded-lg shadow-lg flex flex-col items-start gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between w-full items-center">
          <div className="flex gap-3 items-center">
            <Gamepad2 className="text-white" />
            <span className="text-2xl text-white font-semibold">{plano}</span>
          </div>
          <span className="text-sm text-white">{planoType}</span>
        </div>
        <div className="flex gap-1 items-end">
          <span className="text-4xl font-semibold text-white">{`R$${preco}`}</span>
          <span className="text-white text-sm pb-1">/mês</span>
        </div>
        <p className="text-white text-center text-base mt-2">{descricao}</p>
      </div>
      <button className="w-full py-3 bg-white text-blue-900 rounded-lg transition duration-300">
        <a className="text-base" href={WHATSAPP_URL} target="_blank">
          Contratar planos
        </a>
      </button>
      <div className="mb-6 w-full">
        <ul className="space-y-3 p-3">
          {beneficios.map((beneficio) => (
            <li key={beneficio} className="flex items-center text-white text-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-white mr-2" />
              <span>{beneficio}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Planos() {
  return (
    <div className="flex flex-col items-center p-4 gap-10 w-full max-w-[1440px] mx-auto">
      <div className="flex flex-col mt-16 justify-start items-center w-full">
        <h2 className="text-center font-bold text-4xl md:text-6xl lg:text-[300px] text-gradient-custom">PLANOS</h2>
        <p className="text-center md:w-[722.27px]">
          Benefícios projetados para proporcionar uma experiência integrada, <br /> segura e acessível para todos os clientes.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:items-center lg:flex gap-6 mt-10">
        <PlanoCard
          plano="200 MEGAS"
          preco="79,90"
          descricao="Plano básico para você que só precisa de uma conexão estavél"
          beneficios={["WI-FI 6G", "INSTALAÇÃO GRÁTIS", "EQUIP. ACOMODADO", "100% FIBRA"]}
        />
        <PlanoDestaqueCard
          plano="650 MEGAS"
          preco="149,99"
          descricao="Para você que quer alta performance em seus jogos"
          planoType="[PLANO GAMER]"
          beneficios={["1 IP FIXO", "WI-FI 6G", "INSTALAÇÃO GRÁTIS", "EQUIP. ACOMODATO", "100% FIBRA"]}
        />
        <PlanoCard
          plano="1 GIGA"
          preco="139,90"
          descricao="Para uma familia grande, e atender vários aparelhos em casa"
          beneficios={["WI-FI 6G", "INSTALAÇÃO GRÁTIS", "EQUIP. ACOMODADO", "100% FIBRA"]}
        />
      </div>
    </div>
  );
}
