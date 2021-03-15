import { Directive, HostListener } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { state, showForRange, caretRangeFromPoint } from '../../../../extension/build-for-site/common';

@Directive({
  selector: '[onclickTranslation]'
})
export class OnclickTranslationDirective {

  constructor(private api: ApiService) { }

  @HostListener('click', ['$event'])
  onClickTranslation(e: MouseEvent) {
    state.apiCall = (httpMethod: string, apiMethod: string, body: any) => {
      return this.api.apiRequest(httpMethod, apiMethod, { body }).toPromise();
    };
    console.log('click event 3', e);
    showForRange(caretRangeFromPoint(e.x, e.y));
  }
}