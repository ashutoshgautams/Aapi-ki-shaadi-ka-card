"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useAsset } from "@/components/Asset";
import { useLang } from "@/components/LangProvider";
import { assets } from "@/lib/assets";
import { couple, scripture } from "@/lib/invite";

/**
 * Act I — what lies beyond the doors. The photograph drifts and scales behind
 * the names as you scroll, so the page opens like a camera move into the
 * courtyard rather than a static hero.
 */
export function Overture() {
  const { t, lang } = useLang();
  const track = useRef<HTMLDivElement>(null);
  const hasHero = useAsset(assets.hero);

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.18]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const textFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={track} className="relative h-[200svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0">
          {hasHero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={assets.hero} alt="" className="h-full w-full object-cover" />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(180deg, #FFFFFF 0%, #F1F7FC 30%, #DCEAF5 62%, #C4DCEF 100%)",
              }}
            />
          )}
        </motion.div>

        {/* the words need a clean field to sit in, whatever the photograph does */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 92% 62% at 50% 52%, rgba(255,255,255,.94), rgba(255,255,255,.72) 42%, rgba(255,255,255,.34) 68%, rgba(255,255,255,.12) 100%)",
          }}
        />

        <motion.div
          style={{ y: textY, opacity: textFade }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8 text-center"
        >
          <p className="font-arabic text-[clamp(1.15rem,4.6vw,1.7rem)] leading-loose text-[color:var(--color-indigo)]">
            {scripture.bismillah}
          </p>

          <span className="hairline my-7 w-40" />

          <p className="eyebrow">{t("togetherWithFamilies")}</p>

          <h1 className="font-display mt-4 flex max-w-[min(84vw,32rem)] flex-col items-center leading-[0.92] font-light text-[color:var(--color-indigo)]">
            <span className="text-[clamp(3rem,15vw,6rem)]">
              {lang === "ur" ? couple.bride.urdu : couple.bride.name.split(" ")[0]}
            </span>
            <span className="font-display my-2 text-[clamp(1.4rem,5vw,2rem)] italic text-[color:var(--color-gold)]">
              &amp;
            </span>
            <span className="text-[clamp(3rem,15vw,6rem)]">
              {lang === "ur" ? couple.groom.urdu : couple.groom.name.split(" ")[0]}
            </span>
          </h1>

          <span className="hairline mt-8 w-24" />
          <p className="mt-5 text-[1.1rem] font-medium tracking-[0.12em] text-[color:var(--color-ink)]">
            {t("atPatna")}
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: textFade }}
          className="absolute inset-x-0 bottom-8 z-30 flex flex-col items-center gap-2"
        >
          <span className="text-[0.95rem] font-medium tracking-[0.14em] text-[color:var(--color-ink-soft)]">
            {t("scroll")}
          </span>
          <span className="h-9 w-px bg-gradient-to-b from-[color:var(--color-gold)] to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
