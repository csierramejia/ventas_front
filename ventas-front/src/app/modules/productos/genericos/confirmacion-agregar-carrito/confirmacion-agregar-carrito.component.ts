import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ProductosService } from '../../productos.service';
import { MessageService } from 'primeng/api';
import { ShellState } from 'src/app/states/shell/shell.state';
import { RolloColillaDTO} from 'src/app/dtos/transversal/rollo-colilla.dto'


@Component({
  selector: 'app-confirmacion-agregar-carrito',
  templateUrl: './confirmacion-agregar-carrito.component.html',
  styleUrls: ['./confirmacion-agregar-carrito.component.css'],
  providers: [ProductosService]
})

export class ConfirmacionAgregarCarritoComponent extends CommonComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line: no-output-native
  @Output() closePopup: EventEmitter<any> = new EventEmitter();
  @Output() eventoCrearEditar: EventEmitter<any> = new EventEmitter();

  isCreate = false;

  colilla = '';
  numeros = '';
  loterias = '';
  apostado = 0;
  iva = 0;
  total = 0;
  public idRollo: number;
  public rolloColilla : RolloColillaDTO;
  public idUsuario: number;
  


  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
    private shellState: ShellState
  ) {
    super();
  }

  ngOnInit(): void {
  }


  validEventoCrearEditar(){
    this.eventoCrearEditar.emit(true);
  }

  closePopupE(): void {
    this.closePopup.emit(false);
  }



  ngOnDestroy(): void {
    this.messageService.clear();
  }

}
