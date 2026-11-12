import Rolagem from "@/components/eco/Rolagem";
import Nav from "@/components/eco/Nav";
import Hero from "@/components/eco/Hero";
import TextoRevelado from "@/components/eco/TextoRevelado";
import PilhaPlanos from "@/components/eco/PilhaPlanos";
import Chamada from "@/components/eco/Chamada";
import Selos from "@/components/eco/Selos";
import Rodape from "@/components/eco/Rodape";

export default function Home() {
  return (
    <Rolagem>
      <Nav />
      <main>
        <Hero />
        <TextoRevelado />
        <PilhaPlanos />
        <Chamada />
        <Selos />
      </main>
      <Rodape />
    </Rolagem>
  );
}
