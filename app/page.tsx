import SmoothScroll from "@/components/site/SmoothScroll";
import Preloader from "@/components/site/Preloader";
import Header from "@/components/site/Header";
import LiquidCursor from "@/components/site/LiquidCursor";
import BackgroundShift from "@/components/site/BackgroundShift";
import Hero from "@/components/site/Hero";
import Manifesto from "@/components/site/Manifesto";
import VideoReel from "@/components/site/VideoReel";
import Planos from "@/components/site/Planos";
import Segmentos from "@/components/site/Segmentos";
import Duvidas from "@/components/site/Duvidas";
import Rodape from "@/components/site/Rodape";

export default function Home() {
  return (
    <SmoothScroll>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-papel focus:px-4 focus:py-2"
      >
        Pular para o conteúdo
      </a>
      <Preloader />
      <Header />
      <LiquidCursor />
      <main id="conteudo">
        <Hero />
        <Manifesto />
        <VideoReel />
        <Planos />
        <Segmentos />
        <Duvidas />
      </main>
      <Rodape />
      <BackgroundShift />
    </SmoothScroll>
  );
}
