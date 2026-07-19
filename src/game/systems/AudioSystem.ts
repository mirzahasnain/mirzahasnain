import Phaser from "phaser";

export class AudioSystem {
  private scene: Phaser.Scene;
  private unlocked = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  unlock() {
    this.unlocked = true;
  }

  play(key: string, volume = 0.55) {
    if (!this.unlocked) return;
    try {
      this.scene.sound.play(key, { volume });
    } catch {
      // Ignore missing audio on restricted browsers
    }
  }

  pop() {
    this.play("sfx-pop", 0.5);
  }

  coin() {
    this.play("sfx-coin", 0.45);
  }

  countdown() {
    this.play("sfx-countdown", 0.5);
  }

  gameOver() {
    this.play("sfx-gameover", 0.55);
  }

  click() {
    this.play("sfx-click", 0.4);
  }
}
