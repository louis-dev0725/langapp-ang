import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListMaterialsComponent } from '@app/content/materials/list-materials/list-materials.component';

describe('ListMaterialsComponent', () => {
  let component: ListMaterialsComponent;
  let fixture: ComponentFixture<ListMaterialsComponent>;

  beforeEach(waitForAsync(() => {
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
