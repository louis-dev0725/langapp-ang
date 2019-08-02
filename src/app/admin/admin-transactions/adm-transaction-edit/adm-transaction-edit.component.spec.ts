import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmTransactionEditComponent } from './adm-transaction-edit.component';

describe('AdmTransactionEditComponent', () => {
  let component: AdmTransactionEditComponent;
  let fixture: ComponentFixture<AdmTransactionEditComponent>;

  beforeEach(async(() => {
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
