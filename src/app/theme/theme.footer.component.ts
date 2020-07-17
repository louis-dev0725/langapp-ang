import { Component, OnInit } from '@angular/core';
import { APP_NAME, APP_DATE_CREATED } from '@app/config/config';

@Component({
  selector: 'app-footer',
  template: `
    <div class="layout-footer">
      <span> {{ appName }} © {{ dateString }} </span>
      <span class="footer-text-right">
        <a href="">{{ 'Public offer' | translate }}</a> / <a href="">{{ 'Privacy police' | translate }}</a>
      </span>
    </div>
  `
})
export class ThemeFooterComponent implements OnInit {
  public appName = APP_NAME;
  public appDate = +APP_DATE_CREATED;
  public toDay = new Date();
  public dateString;

  ngOnInit() {
    this.dateString = this.toDay.getFullYear() > this.appDate ? `${this.appDate} - ${this.toDay.getFullYear()}` : this.appDate;
  }
}
