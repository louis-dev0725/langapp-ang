import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmUsersComponent } from '@app/admin/admin-users/adm-users/adm-users.component';

describe('AdmUsersComponent', () => {
  let component: AdmUsersComponent;
  let fixture: ComponentFixture<AdmUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdmUsersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
