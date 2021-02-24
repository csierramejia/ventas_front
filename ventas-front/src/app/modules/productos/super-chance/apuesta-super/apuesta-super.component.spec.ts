import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApuestaSuperComponent } from './apuesta-super.component';

describe('ApuestaSuperComponent', () => {
  let component: ApuestaSuperComponent;
  let fixture: ComponentFixture<ApuestaSuperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApuestaSuperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApuestaSuperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
