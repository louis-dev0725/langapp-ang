import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
import { EventsService } from "@app/services/events.service";
import { untilDestroyed } from "ngx-take-until-destroy";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public isProgressBarLoading: boolean = false;
  public color = 'red';
  public mode = 'indeterminate';
  public value = 50;
  public bufferValue = 75;

  title = 'call-rocket';

  constructor(private translate: TranslateService,
              private eventsService: EventsService) {
    const langMap = {
      'ru-RU': 'ru',
      'en-US': 'en'
    };
    let langVal = localStorage.getItem('lang');
    if (!langVal) {
      langVal = navigator.language;
      if (langMap[langVal]) {
        langVal = langMap[langVal];
      }
      if (langVal !== 'ru' && langVal !== 'en') {
        langVal = 'en'
      }
      localStorage.setItem('lang', langVal);
    }
    this.translate.setDefaultLang(langVal);
  }

  ngOnInit() {
    this.eventsService.progressBarLoading.pipe(
      untilDestroyed(this)
    ).subscribe((event: boolean) => {
      this.isProgressBarLoading = event;
    })
  }

  ngOnDestroy() {
  }
}
