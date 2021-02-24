import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import videojs, { VideoJsPlayerOptions } from 'video.js';
import 'videojs-youtube';

@Component({
  selector: 'app-videojs',
  templateUrl: './videojs.component.html',
  styleUrls: ['./videojs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideojsComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @ViewChild('target', { static: true }) target: ElementRef;
  @Input() options: VideoJsPlayerOptions;
  player: videojs.Player;

  constructor(
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
  }

  initPlayer() {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
    let targetEl = <HTMLElement>this.target.nativeElement;
    targetEl.insertAdjacentHTML('beforebegin', '<video class="video-js vjs-theme-forest vjs-fill" controls playsinline preload="none"></video>');
    let videoEl = targetEl.parentNode.querySelector('video');
    this.player = videojs(videoEl, this.options, function onPlayerReady() {
      (window as any).player = this;
    });
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initPlayer();
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
