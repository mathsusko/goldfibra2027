"use client";

import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import SplitReveal from "./SplitReveal";
import { FAQ } from "@/lib/content";

export default function Duvidas() {
  return (
    <section id="duvidas" data-bg="#eef0f8" className="gutter scroll-mt-24 py-24 md:py-36">
      <div className="grid gap-12 md:grid-cols-12">
        <SplitReveal className="display text-[clamp(2.5rem,4.4vw,4.75rem)] md:col-span-5">Dúvidas frequentes</SplitReveal>

        <AccordionPrimitive.Root type="single" collapsible className="md:col-span-7 md:col-start-6">
          {FAQ.map((item, i) => (
            <AccordionPrimitive.Item key={item.pergunta} value={`q${i}`} className="border-t last:border-b">
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger className="group flex w-full items-start justify-between gap-6 py-6 text-left text-lg font-medium md:text-xl">
                  <span>{item.pergunta}</span>
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-papel transition-[transform,background-color,color] duration-500 group-hover:bg-eletrico group-hover:text-papel group-data-[state=open]:rotate-45 group-data-[state=open]:bg-tinta group-data-[state=open]:text-papel"
                  >
                    <Plus className="size-4" />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="max-w-[60ch] pb-6 text-muted-foreground md:text-lg">{item.resposta}</p>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  );
}
