import { Component, OnInit } from '@angular/core';
import {ApiService} from "../services/api.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private api: ApiService,
    private translate: TranslateService) {

  }

  ngOnInit() {

  }

  setLanguage(lang: string) {
    this.translate.use(lang);
  }
}
