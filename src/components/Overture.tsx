"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArchFrame, MahalSkyline } from "@/components/art/Mahal";
import { Motes } from "@/components/art/Motes";
import { couple, scripture } from "@/lib/invite";

/**
 * Act I. The camera looks through an iwan onto the palace. Scrolling dollies
 * the arch forward and drifts the skyline behind it, so the page moves like a
 * shot rather than a scroll.
 */
export function Overture() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end start"],
  });

  const farY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const frameScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const textFade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={track} className="relative h-[200svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* sky */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, #eaf3fa 34%, #dbeaf6 62%, #c9e0f1 100%)",
          }}
        />

        {/* sun haze behind the centre of the arch */}
        <div
          className="absolute left-1/2 top-[52%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,246,222,.95) 0%, rgba(220,193,136,.35) 40%, rgba(220,193,136,0) 70%)",
          }}
        />

        <motion.div style={{ y: farY }} className="absolute inset-x-0 bottom-0 h-[62%]">
          <MahalSkyline depth="far" className="h-full w-full" />
        </motion.div>

        <motion.div style={{ y: midY }} className="absolute inset-x-0 bottom-0 h-[48%]">
          <MahalSkyline depth="mid" className="h-full w-full" />
        </motion.div>

        <Motes className="absolute inset-0 h-full w-full" count={22} />

        {/* the words, framed by the opening */}
        <motion.div
          style={{ y: textY, opacity: textFade }}
          className="absolute inset-0 z-20 flex translate-y-[10%] flex-col items-center justify-center px-8 text-center"
        >
          <p className="font-arabic text-[clamp(1.15rem,4.6vw,1.7rem)] leading-loose text-[color:var(--color-indigo)]">
            {scripture.bismillah}
          </p>

          <div className="hairline my-6 w-40" />

          <p className="eyebrow text-[color:var(--color-azure-deep)]">
            Together with their families
          </p>

          <h1 className="font-display mt-3 flex max-w-[min(72vw,26rem)] flex-col items-center leading-[0.95] font-medium text-[color:var(--color-indigo)]">
            <span className="text-[clamp(2.6rem,12vw,4.6rem)]">
              {couple.bride.name.split(" ")[0]}
            </span>
            <span className="font-arabic my-1 text-[clamp(0.85rem,3.4vw,1.1rem)] text-[color:var(--color-gold)]">
              و
            </span>
            <span className="text-[clamp(2.6rem,12vw,4.6rem)]">
              {couple.groom.name.split(" ")[0]}
            </span>
          </h1>

          <p className="eyebrow mt-6 text-[0.62rem] text-[color:var(--color-ink-soft)]">
            24 October 2026 &nbsp;·&nbsp; Patna
          </p>
        </motion.div>

        {/* foreground iwan — drawn last so the text reads as being inside it */}
        <motion.div
          style={{ scale: frameScale }}
          className="pointer-events-none absolute inset-0 z-30 origin-center"
        >
          <ArchFrame className="h-full w-full" />
        </motion.div>

        <motion.div
          style={{ opacity: textFade }}
          className="absolute inset-x-0 bottom-7 z-40 flex flex-col items-center gap-2"
        >
          <span className="eyebrow text-[0.55rem] text-[color:var(--color-ink-soft)]">Scroll</span>
          <span className="h-8 w-px bg-gradient-to-b from-[color:var(--color-gold)] to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
