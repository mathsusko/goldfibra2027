import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import Roll from "./Roll";

type PillProps = ComponentProps<"a"> & {
  label: string;
  tone?: "tinta" | "papel" | "eletrico";
};

const tones = {
  tinta: "bg-tinta text-papel",
  papel: "bg-papel text-tinta",
  eletrico: "bg-eletrico text-papel",
};

/** Botão-pílula com ponto vermelho (sinal) e rolagem de letras no hover. */
export default function Pill({ label, tone = "tinta", className, ...props }: PillProps) {
  const external = props.href?.startsWith("http");
  return (
    <a
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
      className={cn(
        "group inline-flex h-11 items-center gap-3 rounded-full px-5 text-[0.8125rem] font-semibold tracking-wide uppercase shadow-[0_6px_20px_-12px_rgb(14_28_41/0.5)] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]",
        tones[tone],
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-sinal transition-transform duration-300 group-hover:scale-150" />
      <Roll>{label}</Roll>
    </a>
  );
}
