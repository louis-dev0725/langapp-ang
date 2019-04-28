import { Component, OnInit } from '@angular/core';
import {ApiService} from '../services/api.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    public api: ApiService,
    private router: Router,
    private translate: TranslateService) {

  }

  ngOnInit() {

  }

  setLanguage(lang: string) {
    this.translate.use(lang);
  }

  logout() {
    this.api.logout();
    this.router.navigate(['/'])
  }
}
