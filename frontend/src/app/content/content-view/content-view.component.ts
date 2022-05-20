import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Content, ContentAttributeResponse } from '@app/interfaces/common.interface';
import { ApiService } from '@app/services/api.service';
import {distinctUntilChanged, switchMap} from 'rxjs/operators';
import { VideoJsPlayerOptions } from 'video.js';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { VideojsComponent } from '@app/content/videojs/videojs.component';
import { WebVTTParser } from 'webvtt-parser';
import fullscreen from '@iconify/icons-mdi/fullscreen';
import previous from '@iconify/icons-mdi/previous-title';
import next from '@iconify/icons-mdi/next-title';
import repeat from '@iconify/icons-mdi/repeat';
import play from '@iconify/icons-mdi/play-circle-filled';
import pause from '@iconify/icons-mdi/pause-circle-filled';

interface Subtitle {
  startTime: number;
  endTime: number;
  text: any;
}

@UntilDestroy()
@Component({
  selector: 'app-content-view',
  templateUrl: './content-view.component.html',
  styleUrls: ['./content-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentViewComponent implements OnInit {
  @ViewChild(VideojsComponent, { static: false }) video: VideojsComponent;
  @ViewChild('subtitleList') subtitleList: ElementRef;

  content: Content;
  subtitles: Subtitle[];
  selectedSubtitles: Subtitle[];
  selectedSubtitleIndexes = [];
  videoOptions: VideoJsPlayerOptions;
  openShortcutsModal = false;
  openReportModal = false;
  isVideoPlaying = false;
  isShowingMoreOverlayContent = false;
  isShowingFontSizeOverlayContent = false;
  isListeningVideo = false;
  isFullScreen = false;
  speedList = ['0.5', '0.75', '1.0', '1.5'];
  currentPlaySpeed: string;
  subtitleStyle = {
    height: '150px',
    display: 'flex',
    'flex-direction': 'column',
    'justify-content': 'center',
  };
  subtitleStyles = [
    {
      label: '175%',
      style: { 'font-size': '35px', ...this.subtitleStyle,},
    },
    {
      label: '150%',
      style: { 'font-size': '30px', ...this.subtitleStyle,},
    },
    {
      label: '125%',
      style: { 'font-size': '25px', ...this.subtitleStyle,},
    },
    {
      label: '100%',
      style: { 'font-size': '20px', ...this.subtitleStyle },
    },
    {
      label: '90%',
      style: { 'font-size': '18px', ...this.subtitleStyle },
    }
  ];
  shortcuts = [
    {
      id: 1,
      shortcut: 'Space',
      action: 'Pause/Play video',
    },
    {
      id: 2,
      shortcut: 'Right arrow',
      action: 'Next subtitle',
    },
    {
      id: 3,
      shortcut: 'Left arrow',
      action: 'Previous subtitle',
    },
    {
      id: 4,
      shortcut: 'r',
      action: 'Repeat sentence',
    },
  ];
  currentSubtitleStyle = this.subtitleStyles[3].style;
  currentSubtitleStyleIndex: number;
  isRepeatingVideo = new FormControl(false);

  reportReason = new FormControl(null, [Validators.required]);

  icons = {
    fullscreen,
    previous,
    next,
    repeat,
    play,
    pause,
  };

  @HostListener('document:keydown.space', ['$event'])
  handleSpaceShortcut(event: KeyboardEvent) {
    event.preventDefault();
    if (this.isVideoPlaying) {
      this.pause();
      return;
    }
    this.play();
  }

  @HostListener('document:keydown.ArrowRight', ['$event'])
  handleRightArrowShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.nextSubtitle();
  }

  @HostListener('document:keydown.ArrowLeft', ['$event'])
  handleLeftArrowShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.previousSubtitle();
  }

  @HostListener('document:keydown.r', ['$event'])
  handleRepeatShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.repeatSubtitle();
  }

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cd: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isRepeatingVideo.setValue(!!+localStorage.getItem('IS_REPEATING_VIDEO'));
    const styleIndex = +localStorage.getItem('CURRENT_SUBTITLE_STYLE');
    this.currentSubtitleStyle = this.subtitleStyles[styleIndex].style;
    this.currentSubtitleStyleIndex = styleIndex;
    this.currentPlaySpeed = localStorage.getItem('PLAY_SPEED');
    this.route.params
      .pipe(
        untilDestroyed(this),
        switchMap((params) => {
          const id = params.id;
          return this.api.contentById(Number(id));
        })
      )
      .subscribe((content) => {
        this.resetVideoParameters();
        this.content = content;
        this.videoOptions = this.setVideoOptions(content);
        const parser = new WebVTTParser();
        const parseResult = parser.parse(content.text);
        this.subtitles = parseResult.cues;
        this.cd.markForCheck();
      });
    this.subscribeToIsRepeatingVideo();
    addEventListener('fullscreenchange', () => {
      this.isFullScreen = !!document.fullscreenElement;
      this.cd.markForCheck();
    });
  }

  listenPlayer() {
    this.video.player.ready(() => {
      this.listenToCurrentTime();
    });
  }

  selectSubtitle(subtitle: Subtitle, index: number) {
    this.selectedSubtitles = [subtitle];
    this.selectedSubtitleIndexes = [index];
    this.playSubtitle(subtitle.startTime);
    this.cd.markForCheck();
  }

  fullScreen() {
    const subControls = document.getElementById('subControls');
    const fullscreenElement = document.fullscreenElement;
    if (fullscreenElement) {
      document.exitFullscreen();
    } else {
      subControls.requestFullscreen();
    }
  }

  previousSubtitle() {
    if (this.selectedSubtitleIndexes.indexOf(0) !== -1) {
      return;
    }
    this.selectSubtitle(this.subtitles[this.selectedSubtitleIndexes[0] - 1], this.selectedSubtitleIndexes[0] - 1);
  }

  nextSubtitle() {
    if (this.selectedSubtitleIndexes.indexOf(this.subtitles.length - 1) !== -1) {
      return;
    }
    if (!this.selectedSubtitleIndexes?.length) {
      this.selectSubtitle(this.subtitles[0], 0);
      return;
    }
    this.selectSubtitle(
      this.subtitles[this.selectedSubtitleIndexes[this.selectedSubtitleIndexes.length - 1] + 1],
      this.selectedSubtitleIndexes.length - 1
    );
  }

  playSubtitle(startTime: number, isPaused: boolean = false) {
    if (!this.isListeningVideo) {
      this.isListeningVideo = true;
      this.listenPlayer();
    }
    this.video.player.currentTime(startTime);
    this.video.player.play();
    this.isVideoPlaying = true;
    if (isPaused) {
      setTimeout(() => {
        this.video.player.pause();
      }, (this.selectedSubtitles[this.selectedSubtitles.length - 1].endTime - this.selectedSubtitles[this.selectedSubtitles.length - 1].startTime) * 1000);
    }
  }

  play() {
    if (!this.isListeningVideo) {
      this.isListeningVideo = true;
      this.listenPlayer();
    }
    this.video.player.play();
    this.isVideoPlaying = true;
    this.cd.markForCheck();
  }

  pause() {
    this.video.player.pause();
    this.isVideoPlaying = false;
    this.cd.markForCheck();
  }

  setVideoSpeed(speed: string, overlay: any) {
    if (overlay) {
      overlay.hide();
    }
    this.currentPlaySpeed = speed;
    localStorage.setItem('PLAY_SPEED', speed);
    this.video?.player.playbackRate(+speed);
  }

  openMoreOverlay(moreOverlay: any, event: any, target: any) {
    moreOverlay.toggle(event, target);
    this.isShowingMoreOverlayContent = true;
    this.isShowingFontSizeOverlayContent = false;
    this.cd.markForCheck();
  }

  toggleFontSizeOverlay(isShowingMoreOverlay: boolean, isShowingFontSizeOverlay: boolean) {
    this.isShowingMoreOverlayContent = isShowingMoreOverlay;
    this.isShowingFontSizeOverlayContent = isShowingFontSizeOverlay;
    this.cd.markForCheck();
  }

  selectSubtitleFontSize(index: number, moreOverlay: any) {
    if (moreOverlay) {
      this.toggleFontSizeOverlay(false, false);
      moreOverlay.hide();
    }
    this.currentSubtitleStyle = this.subtitleStyles[index].style;
    this.currentSubtitleStyleIndex = index;
    localStorage.setItem('CURRENT_SUBTITLE_STYLE', index.toString());
    this.cd.markForCheck();
  }

  resetVideoParameters() {
    this.content = null;
    this.isVideoPlaying = false;
    this.isListeningVideo = false;
    this.subtitles = [];
    this.selectedSubtitles = [];
    this.selectedSubtitleIndexes = [];
    this.openShortcutsModal = false;
    this.openReportModal = false;
    this.cd.markForCheck();
  }

  repeatSubtitle() {
    if (this.selectedSubtitles[this.selectedSubtitles.length - 1]) {
      this.playSubtitle(this.selectedSubtitles[this.selectedSubtitles.length - 1].startTime, this.video.player.paused());
    }
  }

  setContentStudiedAttributes(contentId: number) {
    this.api
      .setContentStudiedAttribute(contentId, {
        isStudied: !this.content?.contentAttribute?.isStudied,
      })
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.handleContentAttributes(response);
      });
  }

  setContentHiddenAttributes(contentId: number) {
    this.api
      .setContentHiddenAttribute(contentId, {
        isHidden: !this.content?.contentAttribute?.isHidden,
      })
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.handleContentAttributes(response);
      });
  }

  onChangeReportModal(value: boolean) {
    this.openReportModal = value;
    this.cd.markForCheck();
  }

  onChangeShortcutModal(value: boolean, moreOverlay: any) {
    moreOverlay.hide();
    this.openShortcutsModal = value;
    this.cd.markForCheck();
  }

  sendReport() {
    if (this.reportReason.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error sending form',
        detail: 'Fill report reason.',
        sticky: true,
        closable: true,
      });
      return;
    }
    this.api
      .sendReport({
        contentId: this.content.id,
        userText: this.reportReason.value,
      })
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.onChangeReportModal(false);
      });
  }

  checkInView(element) {
    const cTop = this.subtitleList.nativeElement.scrollTop;
    const cBottom = cTop + this.subtitleList.nativeElement.clientHeight;
    const eTop = element.offsetTop;
    const eBottom = eTop + element.clientHeight;
    return eTop >= cTop && eBottom <= cBottom;
  }

  listenToCurrentTime() {
    this.video.player.on('timeupdate', () => {
      this.isVideoPlaying = !this.video.player.paused();
      this.cd.markForCheck();
      const currentTime = this.video.player.currentTime();
      if (this.video.player.ended()) {
        this.videoEndedHandler();
        if (this.isRepeatingVideo.value) {
          this.play();
        }
        return;
      }
      this.selectedSubtitles = this.subtitles.filter((sub, index) => {
        if (sub.startTime <= currentTime && sub.endTime >= currentTime) {
          this.selectedSubtitleIndexes = [];
          this.selectedSubtitleIndexes.push(index);
          return sub;
        }
      });
      const subtitle = document.getElementById(`sub${this.selectedSubtitleIndexes[this.selectedSubtitleIndexes.length - 1]}`);
      if (!this.checkInView(subtitle)) {
        this.subtitleList.nativeElement.scrollTop += 80;
      }
      this.cd.markForCheck();
    });
  }

  videoEndedHandler() {
    this.video.player.pause();
    this.isVideoPlaying = false;
    this.selectedSubtitles = [];
    this.selectedSubtitleIndexes = [];
    this.cd.markForCheck();
  }

  subscribeToIsRepeatingVideo() {
    this.isRepeatingVideo.valueChanges
      .pipe(
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe(isRepeating => {
        if (isRepeating) {
          localStorage.setItem('IS_REPEATING_VIDEO', '1');
        } else {
          localStorage.setItem('IS_REPEATING_VIDEO', '0');
        }
      });
  }

  private handleContentAttributes(contentAttributes: ContentAttributeResponse) {
    this.content = {
      ...this.content,
      contentAttribute: {
        ...contentAttributes,
      },
    };
    this.cd.markForCheck();
  }

  private setVideoOptions(content: Content): VideoJsPlayerOptions {
    return {
      techOrder: ['youtube'],
      sources: [
        {
          type: 'video/youtube',
          src: content.sourceLink,
        },
      ],
      autoplay: false,
      // @ts-ignore
      youtube: {
        iv_load_policy: 3,
        cc_load_policy: 3,
        hl: 'ja',
        //"autoplay": 1,
      },
    };
  }
}
