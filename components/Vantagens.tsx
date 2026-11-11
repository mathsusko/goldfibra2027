/* eslint-disable @next/next/no-img-element */
type VantagemProps = {
  image: string;
  title: string;
  description: string;
  info: string;
};

const vantagens: VantagemProps[] = [
  { image: "/img/vantagens/one.jpg", title: "INTERNET RESIDECIAL", description: "Estabilidade para casa toda", info: "familia" },
  { image: "/img/vantagens/two.jpg", title: "PARA GAMERS", description: "SEJA TOP 1", info: "player" },
  { image: "/img/vantagens/three.jpg", title: "PARA EMPRESA", description: "Sem interrupções", info: "empresa" },
  { image: "/img/vantagens/four.png", title: "PARA CONDOMINIOS", description: "Padronize toda rede com nós", info: "condominio" },
];

function VantagemCard({ image, title, description, info }: VantagemProps) {
  return (
    <div className="relative w-full h-[300px] md:h-screen rounded-lg overflow-hidden shadow-lg bg-white">
      <img src={image} alt={title} className="w-full h-[300px] md:h-screen object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent opacity-60" />
      <div className="absolute w-full inset-0 flex flex-col md:flex-row gap-3 h-fit items-center text-white p-4 md:p-8 z-10">
        <div className="text-start h-fit w-full md:w-[600px]">
          <h3 className="text-base md:text-4xl font-medium">{title}</h3>
          <p className="text-xs md:text-2xl mt-2">{description}</p>
        </div>
        <div className="h-[1px] bg-white w-full" />
        <p className="text-xs md:text-2xl w-full md:w-fit text-end">{info}</p>
      </div>
    </div>
  );
}

export default function Vantagens() {
  return (
    <div className="flex gap-8 flex-col items-center md:max-w-[1440px] mt-16 mx-4 py-7 md:mx-4 md:items-center lg:mx-auto">
      <div className="w-full">
        <div className="flex flex-col mt-16 justify-start items-start w-full">
          <h2 className="text-center font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[250px] text-gradient-custom">
            GOLDFIBRA
          </h2>
          <p className="text-start md:text-2xl md:w-[722.27px]">
            Com planos que atenderá toda sua residência, não deixamos passar falhas e ainda composto com a melhor comunicação da região.
          </p>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 gap-4">
        {vantagens.map((vantagem) => (
          <VantagemCard key={vantagem.title} {...vantagem} />
        ))}
      </div>
    </div>
  );
}
