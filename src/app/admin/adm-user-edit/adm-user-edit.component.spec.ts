import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmUserEditComponent } from './adm-user-edit.component';

describe('AdmUserEditComponent', () => {
  let component: AdmUserEditComponent;
  let fixture: ComponentFixture<AdmUserEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmUserEditComponent ]
    })
    .compileComponents();
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
