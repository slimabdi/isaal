import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenchmarkViewComponent } from './benchmark-view.component';

describe('BenchmarkViewComponent', () => {
  let component: BenchmarkViewComponent;
  let fixture: ComponentFixture<BenchmarkViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenchmarkViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchmarkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
