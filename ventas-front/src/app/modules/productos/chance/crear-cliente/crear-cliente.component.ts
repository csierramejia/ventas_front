import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})

export class CrearClienteComponent implements OnInit {

  // tslint:disable-next-line: no-output-native
  @Output() closePopup: EventEmitter<any> = new EventEmitter();
  @Output() createCustomer: EventEmitter<any> = new EventEmitter();

  chanceForm = new FormGroup({
    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    primerNombre: new FormControl(''),
    segundoNombre: new FormControl(''),
    primerApellido: new FormControl(''),
    segundoApellido: new FormControl(''),
    correo: new FormControl(''),
    numeroCelular: new FormControl(''),

  });

  constructor() { }

  ngOnInit(): void {
  }

  closePopupE(): void {
    this.closePopup.emit(false);
  }

  createCustomerE(): void {

  }

}
