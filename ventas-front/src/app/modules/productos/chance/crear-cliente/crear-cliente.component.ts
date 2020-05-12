import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ProductosService } from '../../productos.service';
import { MessageService } from 'primeng/api';
import { ShellState } from 'src/app/states/shell/shell.state';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css'],
  providers: [ProductosService]
})

export class CrearClienteComponent extends CommonComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line: no-output-native
  @Output() closePopup: EventEmitter<any> = new EventEmitter();
  @Output() createCustomer: EventEmitter<any> = new EventEmitter();


  // validEmail = false;

  clienteForm = new FormGroup({
    tipoDocumento: new FormControl('', [Validators.required]),
    numeroDocumento: new FormControl('', [Validators.required]),
    primerNombre: new FormControl('', [Validators.required]),
    segundoNombre: new FormControl(''),
    primerApellido: new FormControl('', [Validators.required]),
    segundoApellido: new FormControl(''),
    correo: new FormControl('', [Validators.required, Validators.email]),
    numeroCelular: new FormControl('', [Validators.required]),

  });

  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
    private shellState: ShellState
  ) {
    super();
  }

  ngOnInit(): void {
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que emite el evento indicando
   * que el usuario dicidio no registrar ningun cliente
   * para que posteriormente cerrar el modal
   */
  closePopupE(): void {
    this.closePopup.emit(false);
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de validar
   * si van los campos obligatorios para posteriormente
   * pasar a crear el cliente
   */
  validCreateCustomerE(): void {
    if (
      this.clienteForm.get('tipoDocumento').valid &&
      this.clienteForm.get('tipoDocumento').value !== 'option' &&
      this.clienteForm.get('numeroDocumento').valid &&
      this.clienteForm.get('primerNombre').valid &&
      this.clienteForm.get('primerApellido').valid &&
      this.clienteForm.get('numeroCelular').valid &&
      this.clienteForm.get('correo').valid
      ) {
        const clientSend = {
          tipoDocumento : this.clienteForm.get('tipoDocumento').value,
          numeroDocumento: this.clienteForm.get('numeroDocumento').value,
          primerNombre: this.clienteForm.get('primerNombre').value,
          segundoNombre: this.clienteForm.get('segundoNombre').value,
          primerApellido : this.clienteForm.get('primerApellido').value,
          segundoApellido : this.clienteForm.get('segundoApellido').value,
          celular : this.clienteForm.get('numeroCelular').value,
          correo : this.clienteForm.get('correo').value,
        };
        this.createCustomerService(clientSend);
    } else {
      this.messageService.add(MsjUtil.getMsjError('Usted debe de diligenciar los campos obligatorios'));
    }
  }


  /**
   * @author Luis Hernandez
   * @param clientSend
   * @description Metodo que se encarga de crear el cliente
   */
  createCustomerService(clientSend): void {

    this.productosService.registrarCliente(clientSend).subscribe(
      clienteData => {
        const responseCliente: any = clienteData;
        if (responseCliente.idPersona) {
          this.messageService.add(MsjUtil.getMsjSuccess('Cliente Registrado'));
          this.cleanInputs();
          this.createCustomerE(responseCliente);
        } else {
          this.messageService.add(MsjUtil.getMsjError('Problemas al registrar el cliente'));
        }
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }


  /**
   * @author Luis Hernandez
   * @param customer
   * @description Metodo que se encarga de enviar el cliente que fue creado
   */
  createCustomerE(customer): void {
    this.createCustomer.emit(customer);
  }


  /**
   * @author Luis Hernandez
   * @description Funcion que permite valida que el usuario
   * solo ingrese numeros en los campos donde se espera solo numeros
   * @param e
   */
  keyPressNumber(e) {
    const key = window.Event ? e.which : e.keyCode;
    e.key.replace(/\D|\-/, '');
    return (key >= 48 && key <= 57);
  }


  /**
   * @author Luis Hernandez
   * @description Funcion que permite valida que el usuario
   * solo ingrese letras en los campos donde se espera solo letras
   * @param e
   */
  keyPressChart(e) {
    const filtro = '1234567890'; // Caracteres invalidos
    for (let i = 0; i < e.key.length; i++) {
      console.log(filtro.indexOf(e.key.charAt(i)) === -1);
      if (filtro.indexOf(e.key.charAt(i)) === -1) {
        return true;
      } else {
        return false;
      }
    }
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de limpiar los campos
   */
  cleanInputs(): void {
    this.clienteForm.get('tipoDocumento').setValue('');
    this.clienteForm.get('numeroDocumento').setValue('');
    this.clienteForm.get('primerNombre').setValue('');
    this.clienteForm.get('segundoNombre').setValue('');
    this.clienteForm.get('primerApellido').setValue('');
    this.clienteForm.get('segundoApellido').setValue('');
    this.clienteForm.get('correo').setValue('');
    this.clienteForm.get('numeroCelular').setValue('');
  }



  // esEmailValido(email: string):boolean {
  //   let mailValido = false;
  //     'use strict';

  //     var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  //     if (email.match(EMAIL_REGEX)){
  //       mailValido = true;
  //     }
  //   return mailValido;
  // }


  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
    this.shellState.title.clear();
  }

}
