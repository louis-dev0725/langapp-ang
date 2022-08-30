import { Injectable } from '@angular/core';

enum PlayerStatus {
  playing = 'playing',
  pause = 'pause',
  loading = 'loading',
  ended = 'ended',
  error = 'error',
}

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  public audio: HTMLAudioElement;
  public status: PlayerStatus;

  public queue: string[] = [];

  constructor() {
    this.audio = new Audio();
    this.attachListeners();
  }

  play(audioUrl: string, clearQueue = true) {
    if (!audioUrl) {
      return;
    }
    if (clearQueue) {
      this.clearQueue();
    }
    this.queue.push(audioUrl);
    this.processQueue();
  }

  clearQueue() {
    this.queue = [];
    this.audio.pause();
  }

  processQueue() {
    if (this.queue.length == 0) {
      return;
    }
    if (this.status != PlayerStatus.playing && this.status != PlayerStatus.loading) {
      let audioUrl = this.queue.shift();
      this.audio.src = audioUrl;
      this.audio.play();
    }
  }

  prepareFromUserGesture() {
    this.audio.src = 'data:audio/wav;base64,UklGRiIBAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAATElTVBoAAABJTkZPSVNGVA4AAABMYXZmNTkuMTYuMTAwAGRhdGHcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
    this.audio.play();
  }

  attachListeners(): void {
    this.audio.addEventListener('playing', (e) => this.updatePlayerStatus(e), false);
    this.audio.addEventListener('pause', (e) => this.updatePlayerStatus(e), false);
    // this.audio.addEventListener('waiting', (e) => this.updatePlayerStatus(e), false);
    this.audio.addEventListener('ended', (e) => this.updatePlayerStatus(e), false);
    this.audio.addEventListener('error', (e) => this.updatePlayerStatus(e), false);
  }

  updatePlayerStatus(e: Event): void {
    if (['playing', 'pause', 'loading', 'ended'].indexOf(e.type) !== -1) {
      this.status = <PlayerStatus>e.type;
    }
    this.processQueue();
  }
}
