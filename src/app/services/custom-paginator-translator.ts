import { MatPaginatorIntl } from '@angular/material';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomPaginatorTranslator extends MatPaginatorIntl {
  rangeOf = 'of';

  constructor(private translateService: TranslateService) {
    super();

    this.translateService.onLangChange.subscribe(res => {
      const paginator = res['translations']['paginator'];
      this.itemsPerPageLabel = paginator['Items per page'];
      this.nextPageLabel = paginator['next'];
      this.previousPageLabel = paginator['prev'];
      this.rangeOf = paginator['of'];
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
    };
  }
}
