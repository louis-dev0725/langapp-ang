import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { SessionService } from '@app/services/session.service';
import { ApiService } from '@app/services/api.service';
import { User } from '@app/interfaces/common.interface';
import {UserService} from "@app/services/user.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit, OnDestroy {

  user: User;

  constructor(private userService: UserService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.userService.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      this.user = user;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() { }
}
