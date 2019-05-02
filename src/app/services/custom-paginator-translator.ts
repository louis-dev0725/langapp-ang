import {MatPaginatorIntl} from '@angular/material';
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class CustomPaginatorTranslator extends MatPaginatorIntl {

  rangeOf = 'of';

  constructor(private translateService: TranslateService) {
    super();


    const translateKeys = ['paginator.Items per page', 'paginator.next', 'paginator.of', 'paginator.prev'];

    this.translateService.get(translateKeys).subscribe((res) => {
      this.itemsPerPageLabel = res['paginator.Items per page'];
      this.nextPageLabel = res['paginator.next'];
      this.previousPageLabel = res['paginator.prev'];
      this.rangeOf = res['paginator.of'];
      this.changes.next();
    });


    this.getRangeLabel = (page, pageSize, length) => {
      if (length == 0 || pageSize == 0) {
        return `0 ${this.rangeOf} ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} ${this.rangeOf} ${length}`;
    }
  }


}
