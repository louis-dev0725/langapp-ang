import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationWordComponent } from './translation-word.component';

describe('TranslationWordComponent', () => {
  let component: TranslationWordComponent;
  let fixture: ComponentFixture<TranslationWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslationWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
