import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApuestaChanceComponent } from './apuesta-chance.component';

describe('ApuestaChanceComponent', () => {
  let component: ApuestaChanceComponent;
  let fixture: ComponentFixture<ApuestaChanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApuestaChanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApuestaChanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
