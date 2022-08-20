import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrillWordComponent } from './drill-word.component';

describe('DrillWordComponent', () => {
  let component: DrillWordComponent;
  let fixture: ComponentFixture<DrillWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrillWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrillWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
