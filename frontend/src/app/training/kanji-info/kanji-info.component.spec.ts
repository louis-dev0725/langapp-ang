import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanjiInfoComponent } from './kanji-info.component';

describe('KanjiInfoComponent', () => {
  let component: KanjiInfoComponent;
  let fixture: ComponentFixture<KanjiInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanjiInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanjiInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
