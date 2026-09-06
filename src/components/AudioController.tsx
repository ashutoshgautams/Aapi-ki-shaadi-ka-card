"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/LangProvider";

const TRACK = "/audio/ambience.mp3";

/**
 * Ambient music. Playback is unlocked by the curtain tap (`autostart`), which
 * is the browser-required user gesture; after that the visitor keeps control.
 * If the track file is absent the control removes itself rather than sitting
 * there broken.
 */
export function AudioController({ autostart }: { autostart: boolean }) {
  const { t } = useLang();
  const el = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);
  const started = useRef(false);

  useEffect(() => {
    if (!autostart || started.current) return;
    started.current = true;
    void fade(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autostart]);

  async function fade(on: boolean) {
    const a = el.current;
    if (!a) return;

    if (on) {
      a.volume = 0;
      try {
        await a.play();
      } catch {
        setPlaying(false);
        return;
      }
      setPlaying(true);
      ramp(a, 0.38, 2200);
    } else {
      ramp(a, 0, 700, () => {
        a.pause();
        setPlaying(false);
      });
    }
  }

  if (!available) return null;

  return (
    <>
      <audio
        ref={el}
        src={TRACK}
        loop
        preload="auto"
        onError={() => setAvailable(false)}
      />
      <button
        onClick={() => void fade(!playing)}
        aria-pressed={playing}
        className="fixed right-4 bottom-4 z-40 flex cursor-pointer items-center gap-2.5 rounded-full border border-[color:var(--color-sky-1)] bg-[color:var(--color-paper)]/90 px-4 py-2.5 backdrop-blur transition-colors hover:border-[color:var(--color-azure)]"
      >
        <Equalizer on={playing} />
        <span className="text-[0.95rem] font-medium text-[color:var(--color-ink)]">
          {playing ? t("musicOn") : t("musicOff")}
        </span>
      </button>
    </>
  );
}

function ramp(a: HTMLAudioElement, to: number, ms: number, done?: () => void) {
  const from = a.volume;
  const t0 = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / ms);
    a.volume = from + (to - from) * k;
    if (k < 1) requestAnimationFrame(step);
    else done?.();
  };
  requestAnimationFrame(step);
}

function Equalizer({ on }: { on: boolean }) {
  return (
    <span className="flex h-3.5 w-4 items-end gap-[2px]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="flex-1 rounded-[1px] bg-[color:var(--color-azure-deep)]"
          style={{
            height: on ? undefined : "30%",
            animation: on ? `eqBounce 900ms ${i * 200}ms ease-in-out infinite` : undefined,
          }}
        />
      ))}
      <style>{`@keyframes eqBounce{0%,100%{height:25%}50%{height:100%}}`}</style>
    </span>
  );
}
