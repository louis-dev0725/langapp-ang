import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Content, ContentsArray, ListResponse, User } from '@app/interfaces/common.interface';
import { MatPaginator } from '@angular/material/paginator';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-list-materials',
  templateUrl: './list-materials.component.html',
  styleUrls: ['./list-materials.component.scss']
})
export class ListMaterialsComponent implements OnInit {

  @Input() list: ListResponse<Content>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteM: EventEmitter<any> = new EventEmitter<any>();

  user: User;
  displayedColumns: string[] = ['title', 'level', 'length', 'button'];


  constructor(public session: SessionService) { }

  showRating(item: Content) {
    return item.dataJson?.youtubeVideo?.viewCount + ' views' + (item.dataJson?.youtubeVideo?.wilsonScore ? (', ' + Math.floor(item.dataJson?.youtubeVideo?.wilsonScore * 100) + '% liked') : '');
  }

  ngOnInit() {
    this.user = this.session.user;
    if (this.user.isAdmin) {
      this.displayedColumns.push('admin_column');
    }
  }

  handlePage(event) {
    this.dataChanged.emit(event);
  }

  deleteElement(id) {
    this.deleteM.emit(id);
  }
}
