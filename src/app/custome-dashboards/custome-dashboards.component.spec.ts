import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeDashboardsComponent } from './custome-dashboards.component';

describe('CustomeDashboardsComponent', () => {
  let component: CustomeDashboardsComponent;
  let fixture: ComponentFixture<CustomeDashboardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomeDashboardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeDashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
