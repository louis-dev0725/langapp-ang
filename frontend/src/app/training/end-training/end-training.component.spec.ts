import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndTrainingComponent } from './end-training.component';

describe('EndTrainingComponent', () => {
  let component: EndTrainingComponent;
  let fixture: ComponentFixture<EndTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
