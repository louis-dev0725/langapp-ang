import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsWordKanjiComponent } from './cards-word-kanji.component';

describe('CardsWordKanjiComponent', () => {
  let component: CardsWordKanjiComponent;
  let fixture: ComponentFixture<CardsWordKanjiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsWordKanjiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsWordKanjiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
