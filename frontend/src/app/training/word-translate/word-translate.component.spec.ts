import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WordTranslateComponent } from './word-translate.component';

describe('WordTranslateComponent', () => {
  let component: WordTranslateComponent;
  let fixture: ComponentFixture<WordTranslateComponent>;

  beforeEach(waitForAsync(() => {
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
