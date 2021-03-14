import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardsWordKanjiComponent } from './cards-word-kanji.component';

describe('CardsWordKanjiComponent', () => {
  let component: CardsWordKanjiComponent;
  let fixture: ComponentFixture<CardsWordKanjiComponent>;

  beforeEach(waitForAsync(() => {
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
