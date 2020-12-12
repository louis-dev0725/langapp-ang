import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardsKanjiComponent } from './cards-kanji.component';

describe('CardsKanjiComponent', () => {
  let component: CardsKanjiComponent;
  let fixture: ComponentFixture<CardsKanjiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsKanjiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsKanjiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
