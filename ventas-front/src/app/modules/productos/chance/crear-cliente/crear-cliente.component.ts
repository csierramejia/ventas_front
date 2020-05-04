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
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
    this.shellState.title.clear();
  }

}
