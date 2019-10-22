import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPrintComponent } from './report-print.component';

describe('ReportPrintComponent', () => {
  let component: ReportPrintComponent;
  let fixture: ComponentFixture<ReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
