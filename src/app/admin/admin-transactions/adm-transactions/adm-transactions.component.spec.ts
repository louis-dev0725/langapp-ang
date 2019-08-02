import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmTransactionsComponent } from './adm-transactions.component';

describe('AdmTransactionsComponent', () => {
  let component: AdmTransactionsComponent;
  let fixture: ComponentFixture<AdmTransactionsComponent>;

  beforeEach(async(() => {
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
