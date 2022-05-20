import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSentenceComponent } from './word-sentence.component';

describe('WordSentenceComponent', () => {
  let component: WordSentenceComponent;
  let fixture: ComponentFixture<WordSentenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordSentenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordSentenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
