import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCompitionsComponent } from './my-compitions.component';

describe('MyCompitionsComponent', () => {
  let component: MyCompitionsComponent;
  let fixture: ComponentFixture<MyCompitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCompitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCompitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
