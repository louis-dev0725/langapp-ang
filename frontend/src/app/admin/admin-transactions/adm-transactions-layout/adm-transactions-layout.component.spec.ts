import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {
  AdmTransactionsLayoutComponent
} from '@app/admin/admin-transactions/adm-transactions-layout/adm-transactions-layout.component';

describe('AdmTransactionsLayoutComponent', () => {
  let component: AdmTransactionsLayoutComponent;
  let fixture: ComponentFixture<AdmTransactionsLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdmTransactionsLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmTransactionsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
