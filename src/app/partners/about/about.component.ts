import {Component, OnInit} from '@angular/core';
import {User} from '@app/interfaces/common.interface';
import {SessionService} from '@app/services/session.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  get user(): User {
    return this.session.user;
  }



  constructor(private session: SessionService) {
  }

  ngOnInit() {

  }

}
