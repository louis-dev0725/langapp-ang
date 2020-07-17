import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordTranslateComponent } from './word-translate.component';

describe('WordTranslateComponent', () => {
  let component: WordTranslateComponent;
  let fixture: ComponentFixture<WordTranslateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordTranslateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
