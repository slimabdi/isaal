import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnLoginComponent } from './sn-login.component';

describe('SnLoginComponent', () => {
  let component: SnLoginComponent;
  let fixture: ComponentFixture<SnLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
