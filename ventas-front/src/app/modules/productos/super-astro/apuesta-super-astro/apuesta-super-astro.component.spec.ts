import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApuestaSuperAstroComponent } from './apuesta-super-astro.component';

describe('ApuestaSuperAstroComponent', () => {
  let component: ApuestaSuperAstroComponent;
  let fixture: ComponentFixture<ApuestaSuperAstroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApuestaSuperAstroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApuestaSuperAstroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
