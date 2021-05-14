import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareFormComponent } from './square-form.component';

describe('SquareFormComponent', () => {
  let component: SquareFormComponent;
  let fixture: ComponentFixture<SquareFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquareFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
