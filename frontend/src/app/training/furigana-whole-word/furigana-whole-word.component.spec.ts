import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuriganaWholeWordComponent } from './furigana-whole-word.component';

describe('FuriganaWholeWordComponent', () => {
  let component: FuriganaWholeWordComponent;
  let fixture: ComponentFixture<FuriganaWholeWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuriganaWholeWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuriganaWholeWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
