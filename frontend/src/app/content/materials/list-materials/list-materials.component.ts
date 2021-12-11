import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Content, ListResponse, User } from '@app/interfaces/common.interface';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from '@app/services/user.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-list-materials',
  templateUrl: './list-materials.component.html',
  styleUrls: ['./list-materials.component.scss'],
})
export class ListMaterialsComponent implements OnInit, OnDestroy {
  @Input() list: ListResponse<Content>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteM: EventEmitter<any> = new EventEmitter<any>();

  user: User;
  displayedColumns: string[] = ['title', 'level', 'length', 'button'];

  constructor(public userService: UserService, private cd: ChangeDetectorRef) {}

  showRating(item: Content) {
    return (
      item.dataJson?.youtubeVideo?.viewCount +
      ' views' +
      (item.dataJson?.youtubeVideo?.wilsonScore ? ', ' + Math.floor(item.dataJson?.youtubeVideo?.wilsonScore * 100) + '% liked' : '')
    );
  }

  ngOnInit() {
    this.userService.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      this.user = user;
      if (this.user?.isAdmin) {
        this.displayedColumns.push('admin_column');
      }
      this.cd.markForCheck();
    });
  }

  handlePage(event) {
    this.dataChanged.emit(event);
  }

  deleteElement(id) {
    this.deleteM.emit(id);
  }

  ngOnDestroy() {}
}
