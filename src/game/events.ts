import type { GameBridgeEvents } from "@/lib/game/types";

type ListenerMap = {
  score: Set<(score: number) => void>;
  time: Set<(timeLeft: number) => void>;
  gameOver: Set<(score: number) => void>;
  ready: Set<() => void>;
  start: Set<() => void>;
  restart: Set<() => void>;
};

class GameEventBus {
  private listeners: ListenerMap = {
    score: new Set(),
    time: new Set(),
    gameOver: new Set(),
    ready: new Set(),
    start: new Set(),
    restart: new Set(),
  };

  onScore(cb: (score: number) => void) {
    this.listeners.score.add(cb);
    return () => this.listeners.score.delete(cb);
  }

  onTime(cb: (timeLeft: number) => void) {
    this.listeners.time.add(cb);
    return () => this.listeners.time.delete(cb);
  }

  onGameOver(cb: (score: number) => void) {
    this.listeners.gameOver.add(cb);
    return () => this.listeners.gameOver.delete(cb);
  }

  onReady(cb: () => void) {
    this.listeners.ready.add(cb);
    return () => this.listeners.ready.delete(cb);
  }

  onStart(cb: () => void) {
    this.listeners.start.add(cb);
    return () => this.listeners.start.delete(cb);
  }

  onRestart(cb: () => void) {
    this.listeners.restart.add(cb);
    return () => this.listeners.restart.delete(cb);
  }

  emitScore(score: number) {
    this.listeners.score.forEach((cb) => cb(score));
  }

  emitTime(timeLeft: number) {
    this.listeners.time.forEach((cb) => cb(timeLeft));
  }

  emitGameOver(score: number) {
    this.listeners.gameOver.forEach((cb) => cb(score));
  }

  emitReady() {
    this.listeners.ready.forEach((cb) => cb());
  }

  requestStart() {
    this.listeners.start.forEach((cb) => cb());
  }

  requestRestart() {
    this.listeners.restart.forEach((cb) => cb());
  }

  bind(handlers: Partial<GameBridgeEvents>) {
    const unsubs: Array<() => void> = [];
    if (handlers.onScore) unsubs.push(this.onScore(handlers.onScore));
    if (handlers.onTime) unsubs.push(this.onTime(handlers.onTime));
    if (handlers.onGameOver) unsubs.push(this.onGameOver(handlers.onGameOver));
    if (handlers.onReady) unsubs.push(this.onReady(handlers.onReady));
    return () => unsubs.forEach((u) => u());
  }
}

export const gameBus = new GameEventBus();
