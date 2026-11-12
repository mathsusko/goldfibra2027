import type { ComponentProps, ReactNode } from "react";

const externo = (href?: string) => (href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {});

/** Seta usada nos botões: no hover ela sai pela direita e volta pela esquerda. */
function Seta({ cor }: { cor: string }) {
  return (
    <span className="relative grid size-[30px] shrink-0 place-items-center overflow-hidden rounded-[4px]" style={{ background: cor === "azul" ? "#fff" : "var(--color-azul)" }}>
      <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-[150%]" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke={cor === "azul" ? "var(--color-azul)" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 24 24" className="absolute size-4 -translate-x-[150%] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke={cor === "azul" ? "var(--color-azul)" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

type Props = ComponentProps<"a"> & { children: ReactNode; tom?: "azul" | "branco" };

/** Botão principal: degradê azul (ou branco) com a seta num quadrado. */
export function BotaoSeta({ children, tom = "azul", className = "", ...props }: Props) {
  const fundo =
    tom === "azul"
      ? "bg-[radial-gradient(50%_109%_at_50%_50%,var(--color-azul-claro)_0%,var(--color-azul)_100%)] text-white"
      : "bg-white text-black";
  return (
    <a
      {...externo(props.href)}
      {...props}
      className={`group mono inline-flex items-center justify-between gap-10 rounded-[6px] py-2 pl-4 pr-2 text-[14px] leading-[0.9] shadow-[inset_0_4px_4px_#ffffff1f] transition-[filter] duration-300 hover:brightness-110 ${fundo} ${className}`}
    >
      <span>{children}</span>
      <Seta cor={tom} />
    </a>
  );
}

/** Botão secundário de vidro, com um brilho que atravessa no hover. */
export function BotaoVidro({ children, className = "", borda = false, ...props }: ComponentProps<"a"> & { borda?: boolean }) {
  return (
    <a
      {...externo(props.href)}
      {...props}
      className={`group mono relative inline-flex h-[46px] items-center justify-center overflow-hidden rounded-[6px] px-[18px] text-[16px] text-white backdrop-blur-[6px] ${
        borda ? "border border-white/20" : "bg-white/[0.08]"
      } ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-20%] -translate-x-[170%] skew-x-[-14deg] bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.22)_50%,transparent_65%)] blur-[10px] transition-transform duration-700 ease-out group-hover:translate-x-[170%]"
      />
    </a>
  );
}
