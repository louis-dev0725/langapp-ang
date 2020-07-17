import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsWordComponent } from './cards-word.component';

describe('CardsWordComponent', () => {
  let component: CardsWordComponent;
  let fixture: ComponentFixture<CardsWordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsWordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
