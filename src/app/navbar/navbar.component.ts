import {ChangeDetectorRef, Component} from '@angular/core';
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
export class NavbarComponent {

  private langMap = {
    'ru': 'Русский',
    'en':'English',
  };

  languages = ['Русский', 'English'];

  get currentLang(): string {
    return this.langMap[this.session.lang];
  }

  get isLoggedIn(): boolean {
    return this.session.isLoggedIn;
  }

  constructor(
    public api: ApiService,
    private eventService: EventService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private session: SessionService,
    private translate: TranslateService) {

  }

  setLanguage(lang: any) {
    const idx = this.languages.indexOf(lang);
    this.session.lang = (idx > 0) ? 'en' : 'ru';
    this.translate.use(this.session.lang);
    this.eventService.emitChangeEvent({type: 'language-change'});
  }

  logout() {
    this.api.logout();
    // this.router.navigateByUrl('/')
  }
}
