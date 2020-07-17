import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMnemonicModalComponent } from './create-mnemonic-modal.component';

describe('CreateMnemonicModalComponent', () => {
  let component: CreateMnemonicModalComponent;
  let fixture: ComponentFixture<CreateMnemonicModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMnemonicModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMnemonicModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
