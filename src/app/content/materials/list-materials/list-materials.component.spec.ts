import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMaterialsComponent } from './list-materials.component';

describe('ListMaterialsComponent', () => {
  let component: ListMaterialsComponent;
  let fixture: ComponentFixture<ListMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
