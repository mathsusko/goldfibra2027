const SELOS = ["100% fibra óptica", "Wi-Fi 6G", "Instalação grátis", "IP fixo no gamer", "Suporte local", "Arapongas – PR"];

/** Faixa cinza no lugar dos logos de parceiros da eco: os selos da Goldfibra. */
export default function Selos() {
  return (
    <section data-nav="escuro" aria-label="O que vem em todo plano" className="gutter overflow-hidden bg-[#0c0c0c] py-[18px] md:py-6">
      <ul className="flex flex-wrap items-center justify-start gap-x-10 gap-y-3 md:justify-between">
        {SELOS.map((s) => (
          <li key={s} className="mono flex items-center gap-2 text-[13px] text-[#7c7c7c] md:text-[14px]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-[#7c7c7c]" />
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
