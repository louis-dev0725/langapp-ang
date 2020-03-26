import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Contents } from '@app/interfaces/common.interface';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-materials',
  templateUrl: './list-materials.component.html',
  styleUrls: ['./list-materials.component.scss']
})
export class ListMaterialsComponent implements OnInit {

  @Input() arrayData: Contents;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();

  displayedColumns: string[] = ['title', 'level_JLPT', 'count_symbol', 'button'];


  constructor() { }

  ngOnInit() {

  }

  handlePage(event) {
    this.dataChanged.emit(event);
  }

}
