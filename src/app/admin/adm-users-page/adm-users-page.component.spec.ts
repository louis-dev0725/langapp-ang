import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmUsersPageComponent } from './adm-users-page.component';

describe('AdmUsersPageComponent', () => {
  let component: AdmUsersPageComponent;
  let fixture: ComponentFixture<AdmUsersPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmUsersPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmUsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
