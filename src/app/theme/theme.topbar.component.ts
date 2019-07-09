import {Component} from '@angular/core';
import {ThemeMainComponent} from './theme.main.component';

@Component({
    selector: 'app-topbar',
    templateUrl: './theme.topbar.component.html'
})
export class ThemeTopbarComponent {

    constructor(public app: ThemeMainComponent) {}

}
