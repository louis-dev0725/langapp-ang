import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordAudioComponent } from './word-audio.component';

describe('WordAudioComponent', () => {
  let component: WordAudioComponent;
  let fixture: ComponentFixture<WordAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordAudioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
