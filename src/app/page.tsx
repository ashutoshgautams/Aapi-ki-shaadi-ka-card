"use client";

import { useEffect, useState } from "react";
import { AudioController } from "@/components/AudioController";
import { CurtainGate } from "@/components/CurtainGate";
import { InviteBody } from "@/components/InviteBody";
import { Journey } from "@/components/Journey";
import { Overture } from "@/components/Overture";
import { useSmoothScroll } from "@/components/useSmoothScroll";

export default function Page() {
  const [opened, setOpened] = useState(false);
  const [showCurtain, setShowCurtain] = useState(true);

  useSmoothScroll(opened);

  // ?skipIntro=1 lands straight on the invitation — for anyone re-opening the
  // link who does not want to sit through the curtain again. Resolved after
  // mount so the server and client render the same first frame.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("skipIntro")) {
      setShowCurtain(false);
      setOpened(true);
    }
  }, []);

  return (
    <>
      {showCurtain && <CurtainGate onOpen={() => setOpened(true)} />}
      <AudioController autostart={opened} />
      <main className="grain relative">
        <Overture />
        <Journey />
        <InviteBody />
      </main>
    </>
  );
}
