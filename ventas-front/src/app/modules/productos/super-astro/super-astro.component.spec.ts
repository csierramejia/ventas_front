import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAstroComponent } from './super-astro.component';

describe('SuperAstroComponent', () => {
  let component: SuperAstroComponent;
  let fixture: ComponentFixture<SuperAstroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAstroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAstroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
