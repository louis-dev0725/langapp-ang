import { Component, Inject } from '@angular/core';
import { bindCallback } from 'rxjs';
import { map } from 'rxjs/operators';

import { TAB_ID } from 'src/app/providers/tab-id.provider';

@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss']
})
export class PopupComponent {
  message: any;
  token: string;
  user: any;

  constructor(@Inject(TAB_ID) readonly tabId: number) {}

  async onClick(): Promise<any> {
    this.message = await bindCallback<string>(chrome.tabs.sendMessage.bind(this, this.tabId, 'request'))().pipe(
      map(msg => msg)
      ).toPromise();
    this.token = this.message.token;
    this.user = JSON.parse(this.message.user);
    console.log(this.token);
    console.log(this.user);
  }

  onClickToken() {}
}
