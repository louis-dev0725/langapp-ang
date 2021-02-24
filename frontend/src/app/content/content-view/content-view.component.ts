import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Content } from '@app/interfaces/common.interface';
import { ApiService } from '@app/services/api.service';
import { ContentService } from '@app/services/content.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { VideoJsPlayerOptions } from 'video.js';

@Component({
  selector: 'app-content-view',
  templateUrl: './content-view.component.html',
  styleUrls: ['./content-view.component.scss']
})
export class ContentViewComponent implements OnInit {
  content$: Observable<Content>;
  cleanTextHtml$: Observable<string>;
  videoOptions$: Observable<VideoJsPlayerOptions>;

  constructor(private route: ActivatedRoute,
    private api: ApiService) {
  }

  ngOnInit(): void {
    this.content$ = this.route.paramMap.pipe(
      switchMap(params => {
        let id = params.get('id');
        return this.api.contentById(Number(id));
      })
    );
    this.cleanTextHtml$ = this.content$.pipe(map(p => {
      return this.escapeHtml(p.cleanText).replace(/^(.*?)$/gm, "<p>$1</p>\n");
    }));
    this.videoOptions$ = this.content$.pipe(map(p => {
      let options: VideoJsPlayerOptions = {
        techOrder: ['youtube'],
        sources: [{
          "type": "video/youtube",
          "src": p.sourceLink
        }],
        autoplay: true,
        // @ts-ignore
        youtube: {
          "iv_load_policy": 3,
          "cc_load_policy": 3,
          "hl": "ja",
          //"autoplay": 1,
        },
      };
      return options;
    }));
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
