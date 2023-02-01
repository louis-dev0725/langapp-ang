import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Content, User } from '@app/interfaces/common.interface';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { MaterialsDataSource } from '../materials.data-source';

@UntilDestroy()
@Component({
  selector: 'app-materials-list-item',
  templateUrl: './materials-list-item.component.html',
  styleUrls: ['./materials-list-item.component.scss'],
})
export class ListMaterialsComponent implements OnInit, OnDestroy {
  @Input()
  public item: Content;

  constructor(public router: Router) {}

  showRating(item: Content) {
    return item.dataJson?.youtubeVideo?.viewCount + ' views' + (item.dataJson?.youtubeVideo?.wilsonScore ? ', ' + Math.floor(item.dataJson?.youtubeVideo?.wilsonScore * 100) + '% liked' : '');
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
