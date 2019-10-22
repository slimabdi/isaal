import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDashboardsComponent } from './my-dashboards.component';

describe('MyDashboardsComponent', () => {
  let component: MyDashboardsComponent;
  let fixture: ComponentFixture<MyDashboardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDashboardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
