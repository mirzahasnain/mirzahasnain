"use client";

import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQ_ITEMS } from "@/lib/constants";

export function FAQ() {
  return (
    <section id="faq" className="relative z-10 section-pad">
      <div className="container-site">
        <SectionHeading
          eyebrow="FAQ"
          title="Got Questions?"
          description="Everything you need to know before joining the orbit."
        />
        <Accordion items={FAQ_ITEMS} />
      </div>
    </section>
  );
}
