import Phaser from "phaser";
import { DIFFICULTY, GAME } from "@/lib/game/constants";
import { gameBus } from "@/game/events";
import { AudioSystem } from "@/game/systems/AudioSystem";

type NibboSprite = Phaser.GameObjects.Image & {
  vx?: number;
  vy?: number;
  wobble?: number;
};

export class MainScene extends Phaser.Scene {
  private score = 0;
  private timeLeft: number = GAME.durationSeconds;
  private elapsed = 0;
  private spawnTimer = 0;
  private spawnInterval: number = DIFFICULTY.baseSpawnMs;
  private moveSpeed: number = DIFFICULTY.baseMoveSpeed;
  private playing = false;
  private ended = false;
  private nibbos!: Phaser.GameObjects.Group;
  private audio!: AudioSystem;
  private particleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private glowEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private shakeUntil = 0;

  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image("nibbo", "/game/nibbo.webp");
    this.load.image("coin", "/game/coin.png");
    this.load.image("glow", "/game/glow.png");
    this.load.image("solana", "/game/solana.png");
    this.load.audio("sfx-pop", "/game/sounds/pop.mp3");
    this.load.audio("sfx-coin", "/game/sounds/coin.mp3");
    this.load.audio("sfx-countdown", "/game/sounds/countdown.mp3");
    this.load.audio("sfx-gameover", "/game/sounds/gameover.mp3");
    this.load.audio("sfx-click", "/game/sounds/click.mp3");
  }

  create() {
    this.audio = new AudioSystem(this);
    this.cameras.main.setBackgroundColor("rgba(3,0,20,0)");
    this.createAmbientParticles();
    this.nibbos = this.add.group();

    this.particleEmitter = this.add.particles(0, 0, "coin", {
      speed: { min: 80, max: 220 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.55, end: 0 },
      lifespan: 500,
      gravityY: 180,
      quantity: 0,
      emitting: false,
    });

    this.glowEmitter = this.add.particles(0, 0, "glow", {
      speed: { min: 20, max: 90 },
      scale: { start: 0.45, end: 0 },
      lifespan: 420,
      alpha: { start: 0.8, end: 0 },
      quantity: 0,
      emitting: false,
      blendMode: "ADD",
    });

    this.input.on("gameobjectdown", (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject) => {
      this.catchNibbo(obj as NibboSprite);
    });

    gameBus.onStart(() => this.beginRound());
    gameBus.onRestart(() => this.beginRound());
    gameBus.emitReady();
  }

  private createAmbientParticles() {
    this.add.particles(0, 0, "solana", {
      x: { min: 0, max: this.scale.width },
      y: { min: 0, max: this.scale.height },
      speedY: { min: -18, max: -42 },
      speedX: { min: -10, max: 10 },
      scale: { min: 0.15, max: 0.35 },
      alpha: { start: 0.35, end: 0 },
      lifespan: 6000,
      frequency: 700,
      blendMode: "ADD",
    });

    this.add.particles(0, 0, "glow", {
      x: { min: 0, max: this.scale.width },
      y: { min: 0, max: this.scale.height },
      speed: { min: 4, max: 18 },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 0.25, end: 0 },
      lifespan: 4000,
      frequency: 500,
      blendMode: "ADD",
    });
  }

  beginRound() {
    this.audio.unlock();
    this.audio.click();
    this.score = 0;
    this.timeLeft = GAME.durationSeconds;
    this.elapsed = 0;
    this.spawnTimer = 0;
    this.spawnInterval = DIFFICULTY.baseSpawnMs;
    this.moveSpeed = DIFFICULTY.baseMoveSpeed;
    this.playing = true;
    this.ended = false;
    this.clearNibbos();
    gameBus.emitScore(0);
    gameBus.emitTime(this.timeLeft);
    this.spawnNibbo();
    this.spawnNibbo();
  }

  update(_time: number, delta: number) {
    if (!this.playing || this.ended) return;

    this.elapsed += delta;
    this.spawnTimer += delta;

    const nextTime = Math.max(
      0,
      GAME.durationSeconds - Math.floor(this.elapsed / 1000)
    );
    if (nextTime !== this.timeLeft) {
      this.timeLeft = nextTime;
      gameBus.emitTime(this.timeLeft);
      if (this.timeLeft <= 3 && this.timeLeft > 0) {
        this.audio.countdown();
      }
    }

    this.updateDifficulty();

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      if (this.nibbos.countActive(true) < DIFFICULTY.maxActiveNibbos) {
        this.spawnNibbo();
      }
    }

    this.nibbos.getChildren().forEach((child) => {
      const n = child as NibboSprite;
      if (!n.active) return;
      n.x += (n.vx || 0) * (delta / 1000);
      n.y += (n.vy || 0) * (delta / 1000);
      n.wobble = (n.wobble || 0) + delta * 0.008;
      n.setScale(
        (n.getData("baseScale") as number) * (1 + Math.sin(n.wobble) * 0.06)
      );
      n.rotation = Math.sin(n.wobble * 0.7) * 0.12;

      const margin = 40;
      if (n.x < margin || n.x > this.scale.width - margin) n.vx = -(n.vx || 0);
      if (n.y < margin || n.y > this.scale.height - margin) n.vy = -(n.vy || 0);
      n.x = Phaser.Math.Clamp(n.x, margin, this.scale.width - margin);
      n.y = Phaser.Math.Clamp(n.y, margin, this.scale.height - margin);
    });

    if (this.timeLeft <= 0) {
      this.endRound();
    }

    if (this.time.now < this.shakeUntil) {
      this.cameras.main.setScroll(
        Phaser.Math.Between(-3, 3),
        Phaser.Math.Between(-3, 3)
      );
    } else {
      this.cameras.main.setScroll(0, 0);
    }
  }

  private updateDifficulty() {
    const seconds = Math.floor(this.elapsed / 1000);
    const steps = Math.floor(seconds / GAME.difficultyIntervalSeconds);
    const chaos = this.timeLeft <= GAME.chaosStartSeconds;

    if (chaos) {
      this.spawnInterval = DIFFICULTY.chaosSpawnMs;
      this.moveSpeed = DIFFICULTY.chaosMoveSpeed;
      return;
    }

    this.spawnInterval = Math.max(
      DIFFICULTY.minSpawnMs,
      DIFFICULTY.baseSpawnMs - steps * DIFFICULTY.spawnStepMs
    );
    this.moveSpeed = DIFFICULTY.baseMoveSpeed + steps * DIFFICULTY.moveSpeedStep;
  }

  private spawnNibbo() {
    const padding = 70;
    const x = Phaser.Math.Between(padding, Math.max(padding + 1, this.scale.width - padding));
    const y = Phaser.Math.Between(padding, Math.max(padding + 1, this.scale.height - padding));
    const baseScale = Phaser.Math.FloatBetween(0.42, 0.62);
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const speed = this.moveSpeed * Phaser.Math.FloatBetween(0.7, 1.25);

    const nibbo = this.add.image(x, y, "nibbo") as NibboSprite;
    nibbo.setScale(0);
    nibbo.setInteractive({ useHandCursor: true });
    nibbo.setData("baseScale", baseScale);
    nibbo.vx = Math.cos(angle) * speed;
    nibbo.vy = Math.sin(angle) * speed;
    nibbo.wobble = Math.random() * Math.PI * 2;
    nibbo.setDepth(10);

    this.tweens.add({
      targets: nibbo,
      scale: baseScale,
      duration: 220,
      ease: "Back.Out",
    });

    // Soft neon glow under each NIBBO
    const aura = this.add.image(x, y, "glow");
    aura.setScale(baseScale * 1.4);
    aura.setAlpha(0.35);
    aura.setBlendMode(Phaser.BlendModes.ADD);
    aura.setDepth(9);
    nibbo.setData("aura", aura);

    this.nibbos.add(nibbo);
  }

  private catchNibbo(nibbo: NibboSprite) {
    if (!this.playing || this.ended || !nibbo.active) return;

    this.score += 1;
    gameBus.emitScore(this.score);
    this.audio.pop();
    this.audio.coin();

    const aura = nibbo.getData("aura") as Phaser.GameObjects.Image | undefined;
    this.particleEmitter.explode(10, nibbo.x, nibbo.y);
    this.glowEmitter.explode(6, nibbo.x, nibbo.y);
    this.shakeUntil = this.time.now + 90;

    this.tweens.add({
      targets: nibbo,
      scale: 0,
      alpha: 0,
      angle: Phaser.Math.Between(-30, 30),
      duration: 180,
      ease: "Back.In",
      onComplete: () => {
        aura?.destroy();
        nibbo.destroy();
      },
    });

    if (aura) {
      this.tweens.add({
        targets: aura,
        alpha: 0,
        scale: aura.scale * 1.6,
        duration: 180,
      });
    }

    // Immediately spawn another elsewhere
    this.time.delayedCall(40, () => {
      if (this.playing && !this.ended) this.spawnNibbo();
    });
  }

  private clearNibbos() {
    this.nibbos.getChildren().forEach((child) => {
      const n = child as NibboSprite;
      const aura = n.getData("aura") as Phaser.GameObjects.Image | undefined;
      aura?.destroy();
    });
    this.nibbos.clear(true, true);
  }

  private endRound() {
    if (this.ended) return;
    this.ended = true;
    this.playing = false;
    this.audio.gameOver();
    this.clearNibbos();
    this.cameras.main.setScroll(0, 0);
    gameBus.emitTime(0);
    gameBus.emitGameOver(this.score);
  }
}
