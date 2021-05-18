import { Component, OnInit } from '@angular/core';
import { APP_NAME, APP_DATE_CREATED } from '@app/config/config';

@Component({
  selector: 'app-footer',
  template: `
    <div class="layout-footer">
      <span> {{ appName }} © {{ dateString }} </span>
      <span class="footer-text-right">
      <a href="/">{{ 'Home' | translate }}</a> / <a href="/docs/terms-of-use.pdf" target="_blank">{{ 'Terms of Use' | translate }}</a> / <a href="/docs/privacy-policy.pdf" target="_blank">{{ 'Privacy policy' | translate }}</a> / <a href="/docs/tokutei.pdf" target="_blank">特定商取引に関する法律に基づく表記</a>
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
