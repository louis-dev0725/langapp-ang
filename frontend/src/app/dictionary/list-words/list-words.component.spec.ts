import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWordsComponent } from 'src/app/dictionary/list-words/list-words.component';

describe('ListWordComponent', () => {
  let component: ListWordsComponent;
  let fixture: ComponentFixture<ListWordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
