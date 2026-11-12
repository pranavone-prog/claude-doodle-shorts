import React from "react";
import { Composition } from "remotion";
import { AlarmShort } from "./videos/alarm/Short";
import { FPS, TOTAL } from "./videos/alarm/story";
import { H, W } from "./lib/look";

// Register one composition per short. Copy videos/alarm/ to videos/<name>/ for a new one.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="DoodleShort" component={AlarmShort} durationInFrames={TOTAL} fps={FPS} width={W} height={H} defaultProps={{ withAudio: true }} />
    <Composition id="DoodleShortSilent" component={AlarmShort} durationInFrames={TOTAL} fps={FPS} width={W} height={H} defaultProps={{ withAudio: false }} />
  </>
);
