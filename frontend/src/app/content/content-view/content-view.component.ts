import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Content, ContentAttributeResponse} from '@app/interfaces/common.interface';
import { ApiService } from '@app/services/api.service';
import {switchMap} from 'rxjs/operators';
import { VideoJsPlayerOptions } from 'video.js';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {FormControl, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";

@UntilDestroy()
@Component({
  selector: 'app-content-view',
  templateUrl: './content-view.component.html',
  styleUrls: ['./content-view.component.scss']
})
export class ContentViewComponent implements OnInit {
  content: Content;
  cleanTextHtml: string;
  videoOptions: VideoJsPlayerOptions;
  openModal = false;

  reportReason = new FormControl(null, [Validators.required]);

  constructor(
      private route: ActivatedRoute,
      private api: ApiService,
      private cd: ChangeDetectorRef,
      private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        untilDestroyed(this),
        switchMap(params => {
          const id = params.get('id');
          return this.api.contentById(Number(id));
        }),
      )
      .subscribe(content => {
        this.content = content;
        this.cleanTextHtml = this.escapeHtml(content?.cleanText).replace(/^(.*?)$/gm, '<p>$1</p>\n');
        this.videoOptions = this.setVideoOptions(content);
        this.cd.detectChanges();
      });
  }

  setContentStudiedAttributes(contentId: number) {
    this.api.setContentStudiedAttribute(contentId, {
      isStudied: !this.content?.contentAttribute?.isStudied
    })
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(response => {
        this.handleContentAttributes(response);
      });
  }

  setContentHiddenAttributes(contentId: number) {
    this.api.setContentHiddenAttribute(contentId, {
      isHidden: !this.content?.contentAttribute?.isHidden
    })
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(response => {
        this.handleContentAttributes(response);
      });
  }

  onChangeReportModal(value: boolean) {
    this.openModal = value;
    this.cd.markForCheck();
  }

  sendReport() {
    if (this.reportReason.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error sending form', detail: 'Fill report reason.', sticky: true, closable: true });
      return;
    }
    this.api.sendReport({
      contentId: this.content.id,
      userText: this.reportReason.value
    })
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(() => {
        this.onChangeReportModal(false);
      });
  }

  private handleContentAttributes(contentAttributes: ContentAttributeResponse) {
    this.content = {
      ...this.content,
      contentAttribute: {
        ...contentAttributes
      }
    };
    this.cd.markForCheck();
  }

  private setVideoOptions(content: Content): VideoJsPlayerOptions {
    return {
      techOrder: ['youtube'],
      sources: [{
        'type': 'video/youtube',
        'src': content.sourceLink
      }],
      autoplay: false,
      // @ts-ignore
      youtube: {
        'iv_load_policy': 3,
        'cc_load_policy': 3,
        'hl': 'ja',
        //"autoplay": 1,
      },
    };
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
