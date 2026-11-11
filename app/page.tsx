import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyUs from "@/components/WhyUs";
import Planos from "@/components/Planos";
import Vantagens from "@/components/Vantagens";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <WhyUs />
      <Planos />
      <Vantagens />
      <Footer />
    </main>
  );
}
