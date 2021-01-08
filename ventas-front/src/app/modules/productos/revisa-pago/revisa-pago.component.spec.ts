import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisaPagoComponent } from './revisa-pago.component';

describe('RevisaPagoComponent', () => {
  let component: RevisaPagoComponent;
  let fixture: ComponentFixture<RevisaPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisaPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisaPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
