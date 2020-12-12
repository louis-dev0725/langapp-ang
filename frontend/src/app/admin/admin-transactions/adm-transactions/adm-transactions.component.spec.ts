import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdmTransactionsComponent } from '@app/admin/admin-transactions/adm-transactions/adm-transactions.component';

describe('AdmTransactionsComponent', () => {
  let component: AdmTransactionsComponent;
  let fixture: ComponentFixture<AdmTransactionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdmTransactionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
