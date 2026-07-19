import Phaser from "phaser";
import { MainScene } from "@/game/scenes/MainScene";

export function createGameConfig(
  parent: HTMLElement,
  width: number,
  height: number
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width,
    height,
    backgroundColor: "#00000000",
    transparent: true,
    fps: {
      target: 60,
      forceSetTimeOut: false,
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width,
      height,
    },
    input: {
      activePointers: 3,
    },
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
      powerPreference: "high-performance",
    },
    audio: {
      disableWebAudio: false,
    },
    scene: [MainScene],
    banner: false,
  };
}
