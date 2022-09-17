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
  title = 'langapp';

  topbarTheme = 'light';
  menuTheme = 'light';
  layoutMode = 'light';
  menuMode = 'static';
  isRTL = false;
  inputStyle = 'outlined';
  ripple = false;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}
