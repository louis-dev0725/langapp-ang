import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { Dictionary } from '@app/interfaces/common.interface';


@Component({
  selector: 'app-list-words',
  templateUrl: './list-words.component.html',
  styleUrls: ['./list-words.component.scss']
})
export class ListWordsComponent {

  @Input() arrayData: Dictionary;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteD: EventEmitter<any> = new EventEmitter<any>();
  @Output() interTrue: EventEmitter<any> = new EventEmitter<any>();

  displayedColumns: string[] = ['id', 'original_word', 'literal', 'translate_word', 'workout_progress', 'button_delete'];
  ids: number[] = [];

  constructor() { }

  onToggle(event) {
    if (event.checked) {
      this.ids.push(event.source.value);
    } else {
      const d_id = this.ids.findIndex(el => el === event.source.value);
      this.ids.splice(d_id, 1);
    }

    console.log(this.ids);
    this.interTrue.emit(this.ids);
  }

  allSelectList(list) {
    if (list) {
      this.arrayData.items.forEach((item) => {
        item.checked = true;
        this.ids.push(item.id);
      });
    } else {
      this.arrayData.items.forEach((item) => {
        item.checked = false;
      });
      this.ids = [];
    }

    this.ids = this.ids.filter(this.onlyUnique);
  }

  handlePage(event) {
    this.dataChanged.emit(event);
  }

  deleteElement(id) {
    this.deleteD.emit(id);
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
