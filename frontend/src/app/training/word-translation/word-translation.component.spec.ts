import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordTranslationComponent } from './word-translation.component';

describe('WordTranslationComponent', () => {
  let component: WordTranslationComponent;
  let fixture: ComponentFixture<WordTranslationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordTranslationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
