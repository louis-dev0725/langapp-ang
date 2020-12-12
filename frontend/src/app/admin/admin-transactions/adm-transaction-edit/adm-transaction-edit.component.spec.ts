import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdmTransactionEditComponent } from '@app/admin/admin-transactions/adm-transaction-edit/adm-transaction-edit.component';

describe('AdmTransactionEditComponent', () => {
  let component: AdmTransactionEditComponent;
  let fixture: ComponentFixture<AdmTransactionEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdmTransactionEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmTransactionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
