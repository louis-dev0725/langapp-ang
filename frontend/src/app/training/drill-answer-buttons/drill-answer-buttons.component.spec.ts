import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrillAnswerButtonsComponent } from './drill-answer-buttons.component';

describe('DrillAnswerButtonsComponent', () => {
  let component: DrillAnswerButtonsComponent;
  let fixture: ComponentFixture<DrillAnswerButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrillAnswerButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrillAnswerButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
