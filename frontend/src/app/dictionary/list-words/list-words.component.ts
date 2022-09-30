import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { ListResponse, User } from '@app/interfaces/common.interface';

@Component({
  selector: 'app-list-words',
  templateUrl: './list-words.component.html',
  styleUrls: ['./list-words.component.scss'],
})
export class ListWordsComponent implements OnInit {
  @Input() arrayData: ListResponse<User>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteD: EventEmitter<any> = new EventEmitter<any>();
  @Output() interTrue: EventEmitter<any> = new EventEmitter<any>();
  dictionaryListArray = [];

  displayedColumns: string[] = ['id', 'original_word', 'literal', 'translate_word', 'workout_progress', 'button_delete'];
  ids: number[] = [];

  constructor() {}

  ngOnInit() {
    /*this.arrayData.items.forEach((item) => {
      item.word_on = '';
      item.word_kun = '';
      item.word_translate = '';

      if (item.type === 1) {
        if (item.dictionaryWord.sourceData.readings.ja_on) {
          if (item.dictionaryWord.sourceData.readings.ja_on.length > 0) {
            item.word_on += item.dictionaryWord.sourceData.readings.ja_on.join(', ');
          }
        }

        if (item.dictionaryWord.sourceData.readings.ja_kun) {
          if (item.dictionaryWord.sourceData.readings.ja_kun.length > 0) {
            item.word_kun += item.dictionaryWord.sourceData.readings.ja_kun.join(', ');
          }
        }

        const meanArr = Object.entries(item.dictionaryWord.sourceData.meanings);
        if (meanArr.length > 0) {
          meanArr.forEach((mean) => {
            mean.forEach((lang, l) => {
              if (l === 1) {
                // @ts-ignore
                item.word_translate += lang.join(', ') + ', ';
                if (l === mean.length - 1) {
                  // @ts-ignore
                  item.word_translate += lang.join(', ');
                }
              }
            });
          });
        }
      }

      this.dictionaryListArray.push(item);
    });*/
  }

  onToggle(event) {
    if (event.checked) {
      this.ids.push(event.source.value);
    } else {
      const d_id = this.ids.findIndex((el) => el === event.source.value);
      this.ids.splice(d_id, 1);
    }

    this.interTrue.emit(this.ids);
  }

  allSelectList(list) {
    /*if (list) {
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

    this.ids = this.ids.filter(this.onlyUnique);*/
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
