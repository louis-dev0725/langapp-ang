import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EventsService } from '@app/services/events.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public isProgressBarLoading = false;
  public color = 'red';
  public mode = 'indeterminate';
  public value = 50;
  public bufferValue = 75;

  title = 'langapp';

  topbarTheme = 'light';
  menuTheme = 'light';
  layoutMode = 'light';
  menuMode = 'static';
  isRTL = false;
  inputStyle = 'outlined';
  ripple = false;

  constructor(private translate: TranslateService, private eventsService: EventsService) {
    let langVal = localStorage.getItem('lang');
    if (!langVal) {
      langVal = window.navigator.language.slice(0, 2).toLowerCase();
      if (langVal !== 'ru' && langVal !== 'en') {
        langVal = 'en';
      }
      localStorage.setItem('lang', langVal);
    }
    this.translate.setDefaultLang('en');
    this.translate.use(langVal);
  }

  ngOnInit() {
    this.eventsService.progressBarLoading.pipe(untilDestroyed(this)).subscribe((event: boolean) => {
      this.isProgressBarLoading = event;
    });
  }

  ngOnDestroy() {}
}
