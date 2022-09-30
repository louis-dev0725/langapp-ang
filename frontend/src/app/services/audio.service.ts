import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

enum PlayerStatus {
  playing = 'playing',
  pause = 'pause',
  loading = 'loading',
  ended = 'ended',
  error = 'error',
}

interface PreloadAudioItem {
  started: boolean;
  finished: boolean;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
@UntilDestroy()
export class AudioService {
  public audio: HTMLAudioElement;
  public status: PlayerStatus;

  public queue: string[] = [];

  public inDelayTimeout: any;

  public preloadAudioList: PreloadAudioItem[] = [];

  constructor(private http: HttpClient) {
    this.audio = new Audio();
    this._attachListeners();
  }

  play(audioUrl: string, clearQueue = true) {
    if (!audioUrl) {
      return;
    }
    // console.trace('play', audioUrl, clearQueue);
    if (clearQueue) {
      this.clearQueue();
    }
    this.queue.push(audioUrl);
    if (audioUrl != 'short-pause' && this.queue.length != 1) {
      this.preloadAudio(audioUrl);
    }
    this._processQueue();
  }

  clearQueue() {
    this.queue = [];
    if (this.inDelayTimeout) {
      clearTimeout(this.inDelayTimeout);
      this.inDelayTimeout = null;
    }
    this.audio.pause();
    this.status = PlayerStatus.pause;
  }

  _processQueue() {
    if (this.queue.length == 0) {
      return;
    }
    if (!this.inDelayTimeout && this.status != PlayerStatus.playing && this.status != PlayerStatus.loading) {
      let audioUrl = this.queue.shift();
      if (audioUrl == 'short-pause') {
        this.audio.pause();
        this.inDelayTimeout = setTimeout(() => {
          this.inDelayTimeout = null;
          this._processQueue();
        }, 300);
      } else {
        this.audio.src = audioUrl;
        this.audio.play();
      }
      this.status = PlayerStatus.loading;
    }
  }

  preloadAudio(audioUrl: string) {
    if (!audioUrl) {
      return;
    }
    if (this.preloadAudioList.findIndex((a) => a.url == audioUrl) === -1) {
      this.preloadAudioList.push({ url: audioUrl, finished: false, started: false });
    }
    this._processPreloadAudio();
  }

  _processPreloadAudio() {
    let countInProgress = this.preloadAudioList.filter((a) => a.started && !a.finished).length;
    if (countInProgress < 10) {
      for (let audio of this.preloadAudioList.filter((a) => !a.started)) {
        audio.started = true;
        this._startPreloadAudio(audio);

        countInProgress++;

        if (countInProgress >= 10) {
          break;
        }
      }
    }

    if (this.preloadAudioList.length > 1000) {
      this.preloadAudioList = this.preloadAudioList.slice(-300);
    }
  }

  _startPreloadAudio(audio: PreloadAudioItem) {
    this.http
      .get(audio.url, { responseType: 'blob' })
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        audio.finished = true;
        this._processPreloadAudio();
      });
  }

  prepareFromUserGesture() {
    this.audio.src = 'data:audio/wav;base64,UklGRiIBAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAATElTVBoAAABJTkZPSVNGVA4AAABMYXZmNTkuMTYuMTAwAGRhdGHcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
    this.audio.play();
  }

  _attachListeners(): void {
    this.audio.addEventListener('playing', (e) => this._updatePlayerStatus(e), false);
    this.audio.addEventListener('pause', (e) => this._updatePlayerStatus(e), false);
    // this.audio.addEventListener('waiting', (e) => this.updatePlayerStatus(e), false);
    this.audio.addEventListener('ended', (e) => this._updatePlayerStatus(e), false);
    this.audio.addEventListener('error', (e) => this._updatePlayerStatus(e), false);
  }

  _updatePlayerStatus(e: Event): void {
    if (['playing', 'pause', 'loading', 'ended'].indexOf(e.type) !== -1) {
      this.status = <PlayerStatus>e.type;
    }
    this._processQueue();
  }
}
