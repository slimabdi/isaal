import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenchmarkListComponent } from './benchmark-list.component';

describe('BenchmarkListComponent', () => {
  let component: BenchmarkListComponent;
  let fixture: ComponentFixture<BenchmarkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenchmarkListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchmarkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
