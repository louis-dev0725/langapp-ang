import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {User} from '../../interfaces/common.interface';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  get user(): User {
    return this.api.user;
  }



  constructor(private api: ApiService) {
  }

  ngOnInit() {

  }

}
