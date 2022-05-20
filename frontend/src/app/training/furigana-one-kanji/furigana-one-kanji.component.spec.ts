import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuriganaOneKanjiComponent } from './furigana-one-kanji.component';

describe('FuriganaOneKanjiComponent', () => {
  let component: FuriganaOneKanjiComponent;
  let fixture: ComponentFixture<FuriganaOneKanjiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuriganaOneKanjiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuriganaOneKanjiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
