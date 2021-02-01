import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ProductosService } from '../../productos.service';
import { MessageService } from 'primeng/api';
import { ShellState } from 'src/app/states/shell/shell.state';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { ClientesDTO } from 'src/app/dtos/productos/chance/clientes.dto';


@Component({
  selector: 'app-buscar-cliente',
  templateUrl: './buscar-cliente.component.html',
  styleUrls: ['./buscar-cliente.component.css'],
  providers: [ProductosService]
})

export class BuscarClienteComponent extends CommonComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line: no-output-native
  @Output() closeModalCliente: EventEmitter<any> = new EventEmitter();
  @Output() closeModalClienteVerCreacion: EventEmitter<any> = new EventEmitter();
  @Output() searchCustomer: EventEmitter<any> = new EventEmitter();



  enabledCustomer = false;
  idCustomer = '';
  nombreCliente = '';
  private correoCustomer: string;


  clienteForm = new FormGroup({
    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    nombreCliente: new FormControl(''),
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
    this.closeModalCliente.emit(false);
  }


  aceptarPopupE(): void {
    let infoCliente = {
      idCustomer: this.idCustomer,
      correoCustomer: this.correoCustomer,
      nombreCliente: this.nombreCliente,
      numeroDocumento: this.clienteForm.get('numeroDocumento').value,
      tipoDocumento: this.clienteForm.get('tipoDocumento').value,
      emitirCliente: 1
    }

    this.searchCustomer.emit(infoCliente)
  }



  /**
   * @author Luis Hernandez
   * @description Funcion que permite valida que el usuario
   * solo ingrese numeros en los campos donde se espera solo numeros
   * @param e
   */
  permitirSoloNumeros(e) {
    const key = window.Event ? e.which : e.keyCode;
    e.key.replace(/\D|\-/, '');
    return (key >= 48 && key <= 57);
  }



  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de validar si
   * existe o no el cliente, si este no existe se
   * levanta un popup para su posterior creación
   */
  validExistClient(): void {

    if (this.clienteForm.get('tipoDocumento').value && this.clienteForm.get('numeroDocumento').value) {
      const clientesDTO: ClientesDTO = new ClientesDTO();
      this.enabledCustomer = false;
      this.clienteForm.controls.nombreCliente.setValue('');
      clientesDTO.numeroDocumento = this.clienteForm.get('numeroDocumento').value;
      clientesDTO.tipoDocumento = this.clienteForm.get('tipoDocumento').value;
      this.productosService.clienteApuesta(clientesDTO).subscribe(
        clienteData => {
          const responseCliente: any = clienteData;
          if (responseCliente.existe) {
            const name = responseCliente.primerNombre + ' ' + responseCliente.segundoNombre + ' ' + responseCliente.primerApellido;
            this.idCustomer = responseCliente.idCliente;
            this.correoCustomer = responseCliente.correo;
            this.nombreCliente = name;
            this.clienteForm.controls.nombreCliente.setValue(name);
            this.enabledCustomer = true;

            // OJO FALTA DEFINIR ESTOOOOOOOOO
            // this.emitirCliente(1);

            
          } else {
            let infoCliente = {
              tipoDocumento: this.clienteForm.get('tipoDocumento').value,
              numeroDocumento: this.clienteForm.get('numeroDocumento').value,
              emitirCliente: 2
            }
            this.closeModalClienteVerCreacion.emit(infoCliente)
          }
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
    }

  }


  

  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
  }

}
