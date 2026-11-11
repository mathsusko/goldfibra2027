/* eslint-disable @next/next/no-img-element */
import { Facebook, FileText, HandCoins, Headset, Instagram, Umbrella, UserCog } from "lucide-react";
import Faq from "./Faq";
import { WHATSAPP_URL } from "./constants";

const linkRapidoClass =
  "flex text-xs md:text-xl items-center gap-3 w-full px-3 py-6 border border-slate-5 hover:bg-white hover:opacity-30 hover:text-blue-950";

function Rodape() {
  return (
    <div className="flex gap-14 flex-col items-center md:max-w-[1440px] mt-16 mx-4 pt-20 md:mx-4 md:items-center lg:mx-auto text-white w-full">
      <div className="w-full flex flex-col items-center gap-5 md:items-start">
        <div>
          <img src="/img/header/logo.svg" alt="Goldfibra" className="md:w-[300px]" />
        </div>
        <div className="w-full flex flex-col gap-14 md:flex-row md:justify">
          <div className="md:w-[500px]">
            <p className="text-center opacity-60 md:text-start">
              GoldFibra Telecomunicações LTDA. Atedimento exclusivo na região CIC.
            </p>
          </div>
          <div className="w-full flex justify-around text-center md:justify-end md:text-end md:gap-8">
            <nav className="flex flex-col gap-2">
              <span className="text-sx opacity-60">Contato</span>
              <ul className="flex flex-col gap-6">
                <li className="flex gap-2 justify-center md:justify-end">
                  <Headset />
                  <a href={WHATSAPP_URL} target="_blank">
                    Suporte
                  </a>
                </li>
                <li className="flex gap-2 justify-center md:justify-end">
                  <HandCoins />
                  <a href={WHATSAPP_URL} target="_blank">
                    Financeiro
                  </a>
                </li>
              </ul>
            </nav>
            <nav className="flex flex-col gap-2">
              <span className="text-sx opacity-60">Sociais</span>
              <ul className="flex flex-col gap-6">
                <li className="flex gap-2 justify-center md:justify-end">
                  <Facebook />
                  <a href="https://facebook.com/goldfibrainternet">Facebook</a>
                </li>
                <li className="flex gap-2 justify-center md:justify-end">
                  <Instagram />
                  <a href="https://www.instagram.com/goldfibrainternet/">Instagram</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div className="w-full">
        <p className="opacity-60 text-xs text-center md:text-start">
          CPNJ: 28.048.928/0001-65 © Copyright 2024, Todos os direitos são reservados para GoldFibra Telecomunicações LTDA.
        </p>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <div className="bg-custom-gradient w-full">
      <div className="flex gap-36 flex-col items-center md:max-w-[1440px] mt-16 mx-4 py-20 md:mx-4 md:items-center lg:mx-auto">
        <div className="flex flex-col gap-8 items-center text-white text-2xl w-full">
          <h2>Links rápidos</h2>
          <div className="w-full grid grid-cols-2 gap-5">
            <div className="w-full flex flex-col gap-6">
              <a href={WHATSAPP_URL} target="_blank" className={linkRapidoClass}>
                <FileText />
                2º Via da Fatura
              </a>
              <a href={WHATSAPP_URL} target="_blank" className={linkRapidoClass}>
                <Headset />
                Suporte
              </a>
            </div>
            <div className="w-full flex flex-col gap-6">
              <a href={WHATSAPP_URL} target="_blank" className={linkRapidoClass}>
                <UserCog />
                Portal do Cliente
              </a>
              <a href={WHATSAPP_URL} target="_blank" className={linkRapidoClass}>
                <Umbrella />
                Financeiro
              </a>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-6">
          <h2 className="text-2xl w-full text-center md:text-start md:text-6xl text-white">
            Perguntas <br /> Frequentes
          </h2>
          <div className="flex justify-center">
            <Faq />
          </div>
        </div>
        <Rodape />
      </div>
    </div>
  );
}
