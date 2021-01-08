import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionAgregarCarritoComponent } from './confirmacion-agregar-carrito.component';

describe('ConfirmacionAgregarCarritoComponent', () => {
  let component: ConfirmacionAgregarCarritoComponent;
  let fixture: ComponentFixture<ConfirmacionAgregarCarritoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmacionAgregarCarritoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionAgregarCarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
