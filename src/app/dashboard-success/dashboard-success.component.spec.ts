import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSuccessComponent } from './dashboard-success.component';

describe('DashboardSuccessComponent', () => {
  let component: DashboardSuccessComponent;
  let fixture: ComponentFixture<DashboardSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
