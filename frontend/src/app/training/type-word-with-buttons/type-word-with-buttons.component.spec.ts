import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeWordWithButtonsComponent } from './type-word-with-buttons.component';

describe('TypeWordWithButtonsComponent', () => {
  let component: TypeWordWithButtonsComponent;
  let fixture: ComponentFixture<TypeWordWithButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeWordWithButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeWordWithButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
