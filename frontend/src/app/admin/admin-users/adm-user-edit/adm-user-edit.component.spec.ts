import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdmUserEditComponent } from '@app/admin/admin-users/adm-user-edit/adm-user-edit.component';

describe('AdmUserEditComponent', () => {
  let component: AdmUserEditComponent;
  let fixture: ComponentFixture<AdmUserEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdmUserEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
