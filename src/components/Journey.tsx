"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useAsset } from "@/components/Asset";
import { useLang } from "@/components/LangProvider";
import { assets } from "@/lib/assets";
import { couple } from "@/lib/invite";

/**
 * Act II. She walks the length of the colonnade; he comes the other way; they
 * meet in the middle. Both are seen only from behind — the invitation is about
 * the occasion, not a portrait.
 *
 * If the cut-out figures have not been supplied the act still works: the
 * corridor and the narration carry it, and nothing stands in for them.
 */
export function Journey() {
  const { t, lang } = useLang();
  const track = useRef<HTMLDivElement>(null);
  const hasCorridor = useAsset(assets.corridor);
  const hasBride = useAsset(assets.bride);
  const hasGroom = useAsset(assets.groom);

  const { scrollYProgress: p } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });

  const brideX = useTransform(p, [0, 0.74], ["-24%", "24%"]);
  const groomX = useTransform(p, [0.16, 0.74], ["124%", "60%"]);
  const walkScale = useTransform(p, [0, 0.74], [0.74, 1]);
  const corridorScale = useTransform(p, [0, 1], [1.05, 1.26]);

  const brideCard = useTransform(p, [0.02, 0.14, 0.34, 0.44], [0, 1, 1, 0]);
  const groomCard = useTransform(p, [0.4, 0.52, 0.66, 0.74], [0, 1, 1, 0]);
  const meetCard = useTransform(p, [0.74, 0.86], [0, 1]);

  return (
    <section ref={track} className="relative h-[320svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-[color:var(--color-marble)]">
        <motion.div style={{ scale: corridorScale }} className="absolute inset-0">
          {hasCorridor ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={assets.corridor} alt="" loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(180deg, #FFFFFF 0%, #EFF6FB 44%, #D8E9F5 78%, #FFFFFF 100%)",
              }}
            />
          )}
        </motion.div>

        {/* keeps the narration legible over any photograph */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,.22) 30%, rgba(255,255,255,.08) 55%, rgba(255,255,255,.45) 100%)",
          }}
        />

        {hasBride && (
          <motion.div
            style={{ x: brideX, scale: walkScale }}
            className="absolute bottom-[14%] left-0 h-[52svh] w-[30svh] origin-bottom"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assets.bride}
              alt=""
              loading="lazy"
              className="h-full w-full object-contain object-bottom drop-shadow-[0_24px_36px_rgba(20,48,74,.22)]"
            />
          </motion.div>
        )}

        {hasGroom && (
          <motion.div
            style={{ x: groomX, scale: walkScale }}
            className="absolute bottom-[14%] left-0 h-[52svh] w-[30svh] origin-bottom"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assets.groom}
              alt=""
              loading="lazy"
              className="h-full w-full object-contain object-bottom drop-shadow-[0_24px_36px_rgba(20,48,74,.22)]"
            />
          </motion.div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-[13svh] flex justify-center px-6">
          <motion.div style={{ opacity: brideCard }} className="absolute w-full max-w-sm">
            <Card
              eyebrow={t("theBride")}
              name={lang === "ur" ? couple.bride.urdu : `${couple.bride.honorific} ${couple.bride.name}`}
              urdu={lang === "ur" ? "" : couple.bride.urdu}
              lines={[couple.bride.line, `${t("daughterOf")} ${couple.bride.parents.join(" & ")}`]}
            />
          </motion.div>

          <motion.div style={{ opacity: groomCard }} className="absolute w-full max-w-sm">
            <Card
              eyebrow={t("theGroom")}
              name={lang === "ur" ? couple.groom.urdu : `${couple.groom.honorific} ${couple.groom.name}`}
              urdu={lang === "ur" ? "" : couple.groom.urdu}
              lines={[`${t("sonOf")} ${couple.groom.parents.join(" & ")}`, couple.groom.place]}
            />
          </motion.div>

          <motion.div style={{ opacity: meetCard }} className="absolute w-full max-w-sm">
            <div className="on-photo text-center">
            <p className="eyebrow">{t("andSo")}</p>
            <p className="font-display mt-4 text-[clamp(1.8rem,7vw,2.8rem)] leading-tight font-light text-[color:var(--color-indigo)]">
              {t("twoFamilies")}
            </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Card({
  eyebrow,
  name,
  urdu,
  lines,
}: {
  eyebrow: string;
  name: string;
  urdu: string;
  lines: string[];
}) {
  return (
    <div className="on-photo text-center">
      <p className="eyebrow">{eyebrow}</p>
      <p className="font-display mt-3 text-[clamp(1.9rem,7vw,2.7rem)] leading-tight font-light text-[color:var(--color-indigo)]">
        {name}
      </p>
      {urdu && <p className="font-urdu mt-1 text-lg text-[color:var(--color-azure-deep)]">{urdu}</p>}
      <span className="hairline mx-auto my-5 block w-24" />
      {lines.filter(Boolean).map((l) => (
        <p key={l} className="readable">
          {l}
        </p>
      ))}
    </div>
  );
}
