"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { couple } from "@/lib/invite";
import { cresting, cuspedArch, finial } from "@/lib/mughal";

/**
 * Act 0. The page opens sealed behind a pair of velvet panels; the visitor
 * taps the foil seal and the mahal is revealed behind them. The tap doubles as
 * the gesture browsers require before audio may play.
 */
export function CurtainGate({ onOpen }: { onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();

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
    window.setTimeout(() => setGone(true), reduced ? 100 : 2100);
  }

  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* The two panels */}
          {(["left", "right"] as const).map((side) => (
            <motion.div
              key={side}
              className="absolute top-0 bottom-0 w-[52%] overflow-hidden"
              style={{
                [side]: 0,
                transformOrigin: side === "left" ? "left center" : "right center",
              }}
              initial={{ x: 0 }}
              animate={open ? { x: side === "left" ? "-102%" : "102%" } : { x: 0 }}
              transition={{ duration: reduced ? 0.1 : 2, ease }}
            >
              <CurtainPanel side={side} />
            </motion.div>
          ))}

          {/* Valance across the top */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-[16vh] min-h-[92px]"
            animate={open ? { y: "-110%" } : { y: 0 }}
            transition={{ duration: reduced ? 0.1 : 1.5, ease }}
          >
            <Valance />
          </motion.div>

          {/* The seal */}
          <motion.div
            className="absolute inset-0 grid place-items-center px-6"
            animate={open ? { opacity: 0, scale: 1.14 } : { opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0.1 : 0.7, ease: "easeOut" }}
          >
            <button
              onClick={pull}
              className="group flex cursor-pointer flex-col items-center gap-6 bg-transparent"
              aria-label="Open the invitation"
            >
              <Seal />
              <span className="font-urdu text-[color:var(--color-marble)] text-lg opacity-90">
                {couple.bride.urdu} · {couple.groom.urdu}
              </span>
              <span className="eyebrow text-[color:var(--color-gold-lite)] transition-opacity group-hover:opacity-70">
                Tap to open
              </span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CurtainPanel({ side }: { side: "left" | "right" }) {
  return (
    <div className="relative h-full w-full">
      {/* velvet folds */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(90deg, #6BA5D2 0px, #A6CCE7 24px, #DCEDF8 44px, #A6CCE7 64px, #5B96C4 94px, #86B9DC 120px)",
        }}
      />
      {/* depth: darker at the outer edge, light where the fold catches */}
      <div
        className="absolute inset-0"
        style={{
          background:
            side === "left"
              ? "linear-gradient(90deg, rgba(15,50,80,.55), rgba(15,50,80,0) 55%, rgba(15,50,80,.28))"
              : "linear-gradient(270deg, rgba(15,50,80,.55), rgba(15,50,80,0) 55%, rgba(15,50,80,.28))",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(20,48,74,.42), rgba(20,48,74,0) 34%, rgba(20,48,74,.3))" }}
      />
      {/* scalloped inner edge */}
      {/* the scalloped inner edge, deepened so the two panels read as separate cloth */}
      <svg
        className="absolute top-0 bottom-0 w-9"
        style={{
          [side === "left" ? "right" : "left"]: "-1px",
          transform: side === "right" ? "scaleX(-1)" : undefined,
        }}
        viewBox="0 0 36 600"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M36 0 H0 V600 H36 Q12 560 36 520 Q12 480 36 440 Q12 400 36 360 Q12 320 36 280 Q12 240 36 200 Q12 160 36 120 Q12 80 36 40 Z"
          fill="#1E4B70"
          opacity="0.55"
        />
      </svg>
      <div className="grain absolute inset-0" />
    </div>
  );
}

function Valance() {
  return (
    <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="valanceFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2F6389" />
          <stop offset="40%" stopColor="#5B96C4" />
          <stop offset="100%" stopColor="#3A75A2" />
        </linearGradient>
      </defs>

      <path
        d="M0 0 H400 V58 Q380 92 360 58 Q340 92 320 58 Q300 92 280 58 Q260 92 240 58 Q220 92 200 58 Q180 92 160 58 Q140 92 120 58 Q100 92 80 58 Q60 92 40 58 Q20 92 0 58 Z"
        fill="url(#valanceFill)"
      />

      {/* gathered folds, so the pelmet reads as cloth rather than a painted band */}
      <g stroke="#1E4B70" strokeWidth="1.6" opacity="0.28">
        {Array.from({ length: 20 }, (_, i) => (
          <path key={i} d={`M${i * 20 + 10} 0 Q${i * 20 + 4} 34 ${i * 20 + 10} 62`} fill="none" />
        ))}
      </g>
      <g stroke="#DCEDF8" strokeWidth="1.2" opacity="0.34">
        {Array.from({ length: 20 }, (_, i) => (
          <path key={i} d={`M${i * 20 + 18} 0 Q${i * 20 + 14} 34 ${i * 20 + 18} 60`} fill="none" />
        ))}
      </g>

      <path
        d="M0 58 Q20 92 40 58 Q60 92 80 58 Q100 92 120 58 Q140 92 160 58 Q180 92 200 58 Q220 92 240 58 Q260 92 280 58 Q300 92 320 58 Q340 92 360 58 Q380 92 400 58"
        fill="none"
        stroke="#DCC188"
        strokeWidth="1.6"
        opacity="0.85"
      />
    </svg>
  );
}

/** The foil medallion: a cusped-arch niche inside a rosette, with a slow shimmer. */
function Seal() {
  const S = 200;
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <svg
      viewBox={`0 0 ${S} ${S}`}
      className="h-40 w-40 drop-shadow-[0_18px_40px_rgba(10,35,60,0.45)] sm:h-48 sm:w-48"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2E3BE" />
          <stop offset="34%" stopColor="#B08D4C" />
          <stop offset="52%" stopColor="#F7EED6" />
          <stop offset="70%" stopColor="#A9884E" />
          <stop offset="100%" stopColor="#DCC188" />
          <animate
            attributeName="x1"
            values="0;0.7;0"
            dur="7s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <circle cx={S / 2} cy={S / 2} r={94} fill="#14304A" opacity="0.35" />
      <g fill="url(#foil)">
        {petals.map((a) => (
          <path
            key={a}
            d="M100 14 C93 34 93 44 100 58 C107 44 107 34 100 14 Z"
            transform={`rotate(${a} 100 100)`}
            opacity={a % 45 === 0 ? 0.95 : 0.62}
          />
        ))}
      </g>
      <circle cx={S / 2} cy={S / 2} r={62} fill="none" stroke="url(#foil)" strokeWidth="2.5" />
      <circle cx={S / 2} cy={S / 2} r={56} fill="#14304A" opacity="0.55" />
      {/* a mihrab niche inside the medallion */}
      <path d={cuspedArch(58, 66, 5)} transform="translate(100 138)" fill="#0E2438" opacity="0.75" />
      <path
        d={cuspedArch(58, 66, 5)}
        transform="translate(100 138)"
        fill="none"
        stroke="url(#foil)"
        strokeWidth="1.8"
      />
      <path d={cuspedArch(34, 38, 5)} transform="translate(100 132)" fill="url(#foil)" opacity="0.85" />
      <path d={finial(15)} transform="translate(100 70)" fill="url(#foil)" />
      <path
        d={cresting(70, 7, 5)}
        transform="translate(100 146)"
        stroke="url(#foil)"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx={S / 2} cy={S / 2} r={92} fill="none" stroke="url(#foil)" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}
