import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavigateActionCardComponent } from './navigate-action-card.component';

describe('NavigateActionCardComponent', () => {
  let component: NavigateActionCardComponent;
  let fixture: ComponentFixture<NavigateActionCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigateActionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigateActionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
