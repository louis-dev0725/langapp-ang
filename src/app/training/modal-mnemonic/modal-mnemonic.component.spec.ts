import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMnemonicComponent } from './modal-mnemonic.component';

describe('ModalMnemonicComponent', () => {
  let component: ModalMnemonicComponent;
  let fixture: ComponentFixture<ModalMnemonicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMnemonicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMnemonicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
