import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmTransactionsLayoutComponent } from './adm-transactions-layout.component';

describe('AdmTransactionsLayoutComponent', () => {
  let component: AdmTransactionsLayoutComponent;
  let fixture: ComponentFixture<AdmTransactionsLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmTransactionsLayoutComponent ]
    })
    .compileComponents();
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
