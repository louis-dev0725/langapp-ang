import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {EventService} from '../event.service';
import {SessionService} from '../services/session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    public api: ApiService,
    private eventService: EventService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private session: SessionService,
    private translate: TranslateService) {

  }

  ngOnInit() {

  }

  setLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
    this.eventService.emitChangeEvent({type: 'language-change'});
  }

  logout() {
    this.api.logout();
    this.router.navigateByUrl('/')
  }
}
