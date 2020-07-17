import { Component, OnInit } from '@angular/core';
import { SessionService } from '@app/services/session.service';
import { ApiService } from '@app/services/api.service';
import { User } from '@app/interfaces/common.interface';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  get user(): User {
    return this.session.user;
  }

  constructor(private api: ApiService, private session: SessionService) {}

  ngOnInit() {
    this.api.meRequest().subscribe((res: any) => {
      // susbs
    });
  }
}
