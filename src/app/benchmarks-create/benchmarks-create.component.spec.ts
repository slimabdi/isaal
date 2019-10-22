import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenchmarksCreateComponent } from './benchmarks-create.component';

describe('BenchmarksComponent', () => {
  let component: BenchmarksCreateComponent;
  let fixture: ComponentFixture<BenchmarksCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenchmarksCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchmarksCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
