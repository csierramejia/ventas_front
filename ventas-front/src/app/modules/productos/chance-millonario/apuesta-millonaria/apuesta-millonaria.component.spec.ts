import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApuestaMillonariaComponent } from './apuesta-millonaria.component';

describe('ApuestaMillonariaComponent', () => {
  let component: ApuestaMillonariaComponent;
  let fixture: ComponentFixture<ApuestaMillonariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApuestaMillonariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApuestaMillonariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
