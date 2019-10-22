import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPlanComponent } from './post-plan.component';

describe('PostPlanComponent', () => {
  let component: PostPlanComponent;
  let fixture: ComponentFixture<PostPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
