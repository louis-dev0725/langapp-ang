import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import videojs, { VideoJsPlayerOptions } from 'video.js';
import 'videojs-youtube';

@Component({
  selector: 'app-videojs',
  templateUrl: './videojs.component.html',
  styleUrls: ['./videojs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideojsComponent implements OnInit, OnDestroy {
  @ViewChild('target', { static: true }) target: ElementRef;
  @Input() options: VideoJsPlayerOptions;
  player: videojs.Player;

  constructor(
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    // instantiate Video.js
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      (window as any).player = this;
    });
  }

  ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.dispose();
    }
  }
}
