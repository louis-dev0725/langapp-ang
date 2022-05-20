import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioWordComponent } from './audio-word.component';

describe('AudioWordComponent', () => {
  let component: AudioWordComponent;
  let fixture: ComponentFixture<AudioWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
