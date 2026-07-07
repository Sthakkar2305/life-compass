"use client";

import { useCallback, useRef, useState } from "react";

export type AmbientSound = "off" | "rain" | "forest" | "library" | "temple" | "ocean" | "soft-piano";

function createNoise(context: AudioContext) {
  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

export function useAmbientSound() {
  const contextRef = useRef<AudioContext | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [active, setActive] = useState<AmbientSound>("off");

  const stop = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    contextRef.current?.close();
    contextRef.current = null;
    setActive("off");
  }, []);

  const play = useCallback(
    (sound: AmbientSound) => {
      stop();
      if (sound === "off") return;
      const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
      const context = new AudioContextClass();
      contextRef.current = context;
      const master = context.createGain();
      master.gain.value = 0.08;
      master.connect(context.destination);
      const nodes: AudioNode[] = [master];
      const intervals: number[] = [];

      if (["rain", "forest", "library", "ocean"].includes(sound)) {
        const noise = createNoise(context);
        const filter = context.createBiquadFilter();
        filter.type = sound === "ocean" ? "lowpass" : "bandpass";
        filter.frequency.value = sound === "rain" ? 2400 : sound === "library" ? 600 : sound === "forest" ? 1800 : 320;
        const gain = context.createGain();
        gain.gain.value = sound === "ocean" ? 0.24 : sound === "rain" ? 0.18 : 0.1;
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        noise.start();
        nodes.push(filter, gain);
        cleanupRef.current = () => noise.stop();
      }

      if (sound === "temple" || sound === "soft-piano" || sound === "forest") {
        const notes = sound === "temple" ? [523.25, 659.25, 784] : [261.63, 329.63, 392, 523.25];
        let step = 0;
        const playTone = () => {
          const osc = context.createOscillator();
          const gain = context.createGain();
          osc.type = sound === "temple" ? "sine" : "triangle";
          osc.frequency.value = notes[step % notes.length];
          gain.gain.setValueAtTime(0.0001, context.currentTime);
          gain.gain.exponentialRampToValueAtTime(sound === "temple" ? 0.12 : 0.055, context.currentTime + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + (sound === "temple" ? 1.8 : 1.1));
          osc.connect(gain);
          gain.connect(master);
          osc.start();
          osc.stop(context.currentTime + 2);
          step += 1;
        };
        playTone();
        intervals.push(window.setInterval(playTone, sound === "temple" ? 4200 : 1600));
      }

      cleanupRef.current = () => {
        nodes.forEach((node) => node.disconnect());
        intervals.forEach((id) => window.clearInterval(id));
      };
      setActive(sound);
    },
    [stop]
  );

  return { active, play, stop };
}
