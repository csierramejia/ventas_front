import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearClienteComponent } from './crear-cliente.component';

describe('CrearClienteComponent', () => {
  let component: CrearClienteComponent;
  let fixture: ComponentFixture<CrearClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
