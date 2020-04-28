import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginComponent } from '@src/app/settings/plugin/plugin.component';

describe('PluginComponent', () => {
  let component: PluginComponent;
  let fixture: ComponentFixture<PluginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PluginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
