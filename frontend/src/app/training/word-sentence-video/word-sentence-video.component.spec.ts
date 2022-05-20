import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSentenceVideoComponent } from './word-sentence-video.component';

describe('WordSentenceVideoComponent', () => {
  let component: WordSentenceVideoComponent;
  let fixture: ComponentFixture<WordSentenceVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordSentenceVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordSentenceVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
