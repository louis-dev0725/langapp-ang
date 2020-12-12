import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateMaterialsComponent } from '@app/content/create-materials/create-materials.component';

describe('CreateMaterialsComponent', () => {
  let component: CreateMaterialsComponent;
  let fixture: ComponentFixture<CreateMaterialsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
