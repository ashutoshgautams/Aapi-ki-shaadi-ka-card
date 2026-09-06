"use client";

import { useEffect, useState } from "react";
import { AudioController } from "@/components/AudioController";
import { DoorGate } from "@/components/DoorGate";
import { InviteBody } from "@/components/InviteBody";
import { Journey } from "@/components/Journey";
import { LangProvider, LangToggle, useLang } from "@/components/LangProvider";
import { Overture } from "@/components/Overture";
import { useSmoothScroll } from "@/components/useSmoothScroll";

export default function Page() {
  return (
    <LangProvider>
      <Invitation />
    </LangProvider>
  );
}

function Invitation() {
  const [opened, setOpened] = useState(false);
  const [showDoors, setShowDoors] = useState(true);
  const { rtl } = useLang();

  useSmoothScroll(opened);

  // ?skipIntro=1 lands straight on the invitation — for anyone re-opening the
  // link who does not want to sit through the doors again. Resolved after
  // mount so the server and client render the same first frame.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("skipIntro")) {
      setShowDoors(false);
      setOpened(true);
    }
  }, []);

  return (
    <>
      {showDoors && <DoorGate onOpen={() => setOpened(true)} />}
      <AudioController autostart={opened} />
      <LangToggle />
      <main className="grain relative" dir={rtl ? "rtl" : "ltr"}>
        <Overture />
        <Journey />
        <InviteBody />
      </main>
    </>
  );
}
