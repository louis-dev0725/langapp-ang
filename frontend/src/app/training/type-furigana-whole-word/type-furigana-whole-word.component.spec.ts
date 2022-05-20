import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeFuriganaWholeWordComponent } from './type-furigana-whole-word.component';

describe('TypeFuriganaWholeWordComponent', () => {
  let component: TypeFuriganaWholeWordComponent;
  let fixture: ComponentFixture<TypeFuriganaWholeWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeFuriganaWholeWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeFuriganaWholeWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
