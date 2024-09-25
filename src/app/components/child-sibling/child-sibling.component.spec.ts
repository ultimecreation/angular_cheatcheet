import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildSiblingComponent } from './child-sibling.component';

describe('ChildSiblingComponent', () => {
  let component: ChildSiblingComponent;
  let fixture: ComponentFixture<ChildSiblingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildSiblingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildSiblingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
