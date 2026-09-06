"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useAsset } from "@/components/Asset";
import { useLang } from "@/components/LangProvider";
import { assets } from "@/lib/assets";
import { couple } from "@/lib/invite";

/**
 * Act 0. A pair of palace doors, split down the middle and swung open in 3D.
 *
 * Both leaves show the same full-width photograph through an overflow box, one
 * anchored left and one right, so the seam in the artwork stays aligned across
 * the join. Swinging in CSS rather than playing a video keeps it sharp at any
 * size, adapts to the screen shape, and costs one still instead of megabytes.
 */
export function DoorGate({ onOpen }: { onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();
  const { t } = useLang();
  const hasDoors = useAsset(assets.doors);
  const hasSeal = useAsset(assets.seal);

  useEffect(() => {
    document.body.dataset.sealed = gone ? "false" : "true";
    return () => {
      document.body.dataset.sealed = "false";
    };
  }, [gone]);

  function pull() {
    if (open) return;
    setOpen(true);
    onOpen();
    window.setTimeout(() => setGone(true), reduced ? 100 : 2400);
  }

  const ease = [0.66, 0, 0.2, 1] as const;

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden bg-[#0E2438]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ perspective: "1700px", perspectiveOrigin: "50% 46%" }}
        >
          {(["left", "right"] as const).map((side) => (
            <motion.div
              key={side}
              className="absolute top-0 bottom-0 w-1/2 overflow-hidden will-change-transform"
              style={{
                [side]: 0,
                transformOrigin: `${side} center`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
              initial={{ rotateY: 0 }}
              animate={open ? { rotateY: side === "left" ? -105 : 105 } : { rotateY: 0 }}
              transition={{ duration: reduced ? 0.1 : 2.2, ease }}
            >
              <div className="absolute top-0 h-full w-[200%]" style={{ [side]: 0 }}>
                {hasDoors ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={assets.doors} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{
                      background:
                        "linear-gradient(100deg, #DCEDF8, #FFFFFF 32%, #E8F1F8 58%, #C9DFEF)",
                    }}
                  />
                )}
              </div>

              {/* the leaf turns away from the light as it swings */}
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    side === "left"
                      ? "linear-gradient(90deg, rgba(8,24,40,.8), rgba(8,24,40,0))"
                      : "linear-gradient(270deg, rgba(8,24,40,.8), rgba(8,24,40,0))",
                }}
                initial={{ opacity: 0.1 }}
                animate={{ opacity: open ? 0.78 : 0.1 }}
                transition={{ duration: reduced ? 0.1 : 2.2, ease }}
              />
            </motion.div>
          ))}

          {/* light spilling through the widening gap */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-1/2 w-[52vw] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,249,232,.95), rgba(255,241,208,.3) 46%, rgba(255,241,208,0) 74%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: reduced ? 0.1 : 1.6, ease: "easeOut" }}
          />

          <motion.div
            className="absolute inset-0 z-10 grid place-items-center px-6"
            animate={open ? { opacity: 0, scale: 1.18 } : { opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0.1 : 0.6, ease: "easeOut" }}
          >
            <button
              onClick={pull}
              className="group relative flex cursor-pointer flex-col items-center gap-5 bg-transparent px-16 py-14"
              aria-label={t("tapToOpen")}
            >
              {/* A pool of shadow so the label reads against any door artwork.
                  It extends well past the button and fades out inside its own
                  box, otherwise the gradient's edge shows as a hard rectangle. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-[70%] -z-10"
                style={{
                  background:
                    "radial-gradient(ellipse 34% 30% at 50% 47%, rgba(6,20,36,.9), rgba(6,20,36,.62) 42%, rgba(6,20,36,.22) 68%, rgba(6,20,36,0) 100%)",
                }}
              />

              {hasSeal ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={assets.seal}
                  alt=""
                  className="h-36 w-36 drop-shadow-[0_20px_44px_rgba(6,18,32,.6)] sm:h-44 sm:w-44"
                />
              ) : (
                <span className="grid h-28 w-28 place-items-center rounded-full border border-[#D9BE86]/70 sm:h-32 sm:w-32">
                  <span className="font-display text-4xl text-[#E7D3A4]">
                    {couple.bride.name[0]}
                    {couple.groom.name[0]}
                  </span>
                </span>
              )}

              <span
                className="font-urdu text-lg text-white"
                style={{ textShadow: "0 2px 16px rgba(6,18,32,.95)" }}
              >
                {couple.bride.urdu} · {couple.groom.urdu}
              </span>
              <span
                className="eyebrow text-[#F3E4BC] transition-opacity group-hover:opacity-70"
                style={{ textShadow: "0 2px 16px rgba(6,18,32,.95)" }}
              >
                {t("tapToOpen")}
              </span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
