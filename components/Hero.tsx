/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight } from "lucide-react";
import styles from "./Hero.module.css";
import { WHATSAPP_URL } from "./constants";

export default function Hero() {
  return (
    <div className="relative z-10 w-full h-screen">
      <img
        src="/img/hero/imageOne.jpg"
        alt="Hero Image"
        className="w-full h-full object-cover absolute z-0"
      />
      <div className="absolute z-10 w-full h-full">
        <div className="flex flex-col justify-center items-center h-screen gap-10 w-full p-4 md:max-w-[1440px] mx-auto">
          <div className="flex flex-col gap-4">
            <h1 className={styles.title}>
              Internet De Qualidade <br />
              Sem Enganos
            </h1>
            <p className="text-white text-center md:text-xl">
              Escolha a internet que combine com você, planos residencial, empresarial e condomínios
            </p>
          </div>
          <button className="flex gap-3 rounded-full px-5 py-3 text-white bg-blue-700 w-fit">
            <a href={WHATSAPP_URL} target="_blank">
              Fale com o atendente
            </a>
            <ArrowUpRight />
          </button>
        </div>
      </div>
    </div>
  );
}
