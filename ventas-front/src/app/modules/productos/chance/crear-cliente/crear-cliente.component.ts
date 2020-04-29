import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ProductosService } from '../../productos.service';
import { MessageService } from 'primeng/api';
import { ShellState } from 'src/app/states/shell/shell.state';
import { MsjUtil } from 'src/app/utilities/messages.util';

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

  clienteForm = new FormGroup({
    tipoDocumento: new FormControl('', [Validators.required]),
    numeroDocumento: new FormControl('', [Validators.required]),
    primerNombre: new FormControl('', [Validators.required]),
    segundoNombre: new FormControl(''),
    primerApellido: new FormControl('', [Validators.required]),
    segundoApellido: new FormControl(''),
    correo: new FormControl(''),
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

  closePopupE(): void {
    this.closePopup.emit(false);
  }

  validCreateCustomerE(): void {

    console.log(this.clienteForm.get('tipoDocumento'));
    console.log(this.clienteForm.get('numeroDocumento'));
    console.log(this.clienteForm.get('primerNombre'));
    console.log(this.clienteForm.get('primerApellido'));
    console.log(this.clienteForm.get('numeroCelular'));


    if (
      this.clienteForm.get('tipoDocumento').valid &&
      this.clienteForm.get('numeroDocumento').valid &&
      this.clienteForm.get('primerNombre').valid &&
      this.clienteForm.get('primerApellido').valid &&
      this.clienteForm.get('numeroCelular').valid
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
      alert('Usted debe de diligenciar los campos obligatorios');
    }

  }

  createCustomerService(clientSend): void {

    console.log('11111');
    console.log(clientSend);
    console.log('11111');

    this.productosService.registrarCliente(clientSend).subscribe(
      clienteData => {
        const responseCliente: any = clienteData;

        console.log('.-.-.-.-.-.');
        console.log(responseCliente);
        console.log('.-.-.-.-.-.');

        // if (responseApuesta.exito) {
        //   this.cleanCartValues();
        //   alert('Transacción exitosa');
        // } else {
        //   alert('Problemas con la transacción');
        // }
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }


  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
    this.shellState.title.clear();
  }

}
