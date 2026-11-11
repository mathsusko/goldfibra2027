import type { ReactNode } from "react";

/** Linha de marcadores "+" de grade, com um rótulo central opcional. */
export default function Crosshairs({ children }: { children?: ReactNode }) {
  return (
    <div aria-hidden={children ? undefined : true} className="flex items-center justify-between py-4 text-tinta/70">
      <span className="text-lg leading-none">+</span>
      <span className="hidden text-lg leading-none md:inline">+</span>
      {children ? <span className="micro">{children}</span> : <span className="text-lg leading-none">+</span>}
      <span className="hidden text-lg leading-none md:inline">+</span>
      <span className="text-lg leading-none">+</span>
    </div>
  );
}
