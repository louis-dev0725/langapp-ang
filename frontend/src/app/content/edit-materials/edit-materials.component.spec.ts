import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMaterialsComponent } from '@app/content/edit-materials/edit-materials.component';

describe('EditMaterialsComponent', () => {
  let component: EditMaterialsComponent;
  let fixture: ComponentFixture<EditMaterialsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
