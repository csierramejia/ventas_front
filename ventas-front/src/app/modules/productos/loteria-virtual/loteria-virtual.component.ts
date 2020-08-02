import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonComponent } from 'src/app/utilities/common.component';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { SpinnerState } from 'src/app/states/spinner.state';
import { LoteriaVirtualConfiguracionDTO } from 'src/app/dtos/productos/loteria-virtual/loteria-virtual-configuracion.dto';
import { TiposDocumentosConstant } from 'src/app/constants/tipos-documentos.constant';
import { ClientesDTO } from 'src/app/dtos/productos/chance/clientes.dto';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { ProductosService } from '../../../modules/productos/productos.service';
import { CrearClienteComponent } from '../chance/crear-cliente/crear-cliente.component';

/**
 * Componente para las ventas de las loterias virtual
 */
@Component({
  templateUrl: './loteria-virtual.component.html',
  styleUrls: ['./loteria-virtual.component.css'],
  providers: [ ProductosService ]
})
export class LoteriaVirtualComponent extends CommonComponent implements OnInit, OnDestroy {

  /** Se utiliza para mostrar la fecha-hora actual */
  public fechaActual = new Date();

  /** Son las loterias con sus configuraciones a mostrar en pantalla */
  public loterias: Array<LoteriaVirtualConfiguracionDTO>;

  /** Son las loterias con sus configuraciones consultadas */
  public loteriasOrigen: Array<LoteriaVirtualConfiguracionDTO>;

  /** Es la loteria seleccionada para el proceso */
  public loteriaSeleccionada: LoteriaVirtualConfiguracionDTO;

  /** Son las loterias agregadas para pagar */
  public loteriasAgregadas: Array<string>;

  /** lista de items de TIPOS DE DOCUMENTOS */
  public itemsTiposDocumentos: SelectItem[];

  /** Tipo de documento para la busqueda del cliente */
  public tipoDocumento: string;

  /** Nro de documento para la busqueda del cliente */
  public nroDocumento: string;

  /** Es el nombre completo del cliente consultado */
  public nombreCompleto: string;

  /** Datos del cliente consultado */
  public cliente: ClientesDTO;

  /** Se utiliza para visualizar el modal de creacion del cliente */
  public showModalCrearCliente: boolean;

  /** Es el filter ingresado para la busqueda de loterias */
  public filterNombreLoteria: string;

  /** Es la cantidad de nro de card que se visualiza en el carousel */
  public carouselNroVisible = 3;

  /** Es el componente modal para la creacion del cliente */
  @ViewChild(CrearClienteComponent) modalCrearCliente: CrearClienteComponent;

  /**
   * @param messageService, Se utiliza para la visualizacion
   * de los mensajes en la pantalla
   *
   * @param productosService, Contiene los procesos de negocio
   * para esta funcionalidad
   *
   * @param confirmationService, se utiliza para mostrar el
   * modal de confirmacion para diferente procesos
   *
   * @param spinnerState, se utiliza para simular el spinner
   */
  constructor(
    protected messageService: MessageService,
    private productosService: ProductosService,
    private confirmationService: ConfirmationService,
    private spinnerState: SpinnerState) {
    super();
  }

  /**
   * Se debe inicializar las variables cuando se crea el component
   */
  ngOnInit(): void {
    this.init();
  }

  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla
   */
  ngOnDestroy(): void {
    this.messageService.clear();
  }

  /**
   * Metodo que permite soportar el evento filter por nombre loteria
   */
  public busquedaLoterias(): void {

    // el valor del filtro no puede ser indefinido
    this.carouselNroVisible = 1;
    if (this.filterNombreLoteria && this.filterNombreLoteria.length) {

      // se crea la instancia de la lista a visualizar
      this.loterias = new Array<LoteriaVirtualConfiguracionDTO>();

      // se busca la loteria que coincide con el valor
      for (const loteria of this.loteriasOrigen) {
        if (loteria.nombreLoteria && loteria.nombreLoteria.toUpperCase().includes(this.filterNombreLoteria.toUpperCase())) {
          this.loterias.push(loteria);
        }
      }
    } else {
      this.loterias = this.loteriasOrigen;
      this.carouselNroVisible = 3;
    }
  }

  /**
   * Funcion que permite validar que solo ingresen datos numericos
   */
  public keyPressNumber(e) {
    const key = window.Event ? e.which : e.keyCode;
    e.key.replace(/\D|\-/, '');
    return (key >= 48 && key <= 57);
  }

  /**
   * Medoto que soporta el evento onchange del tipo y nro documento
   */
  public changeTipoNroDocumento(): void {

    // por si fue consultado con anterioridad
    this.cliente = null;
    this.nombreCompleto = null;
    this.showModalCrearCliente = false;

    // se verifica la nulalidad de nro y tipo doc
    if (this.tipoDocumento && this.nroDocumento) {
      const clientesDTO: ClientesDTO = new ClientesDTO();
      clientesDTO.numeroDocumento = this.nroDocumento;
      clientesDTO.tipoDocumento = this.tipoDocumento;

      // se procede a consultar el cliente
      this.productosService.clienteApuesta(clientesDTO).subscribe(
        data => {
          const responseCliente: any = data;
          if (responseCliente.existe) {
            this.cliente = data;
            this.nombreCompleto = data.primerNombre + ' ' + data.segundoNombre + ' ' + data.primerApellido + ' ' + data.segundoApellido;
          } else {
            this.modalCrearCliente.clienteForm.get('tipoDocumento').setValue(this.tipoDocumento);
            this.modalCrearCliente.clienteForm.get('numeroDocumento').setValue(this.nroDocumento);
            this.showModalCrearCliente = true;
          }
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
    }
  }

  /**
   * Metodo que es invocado por el modal de crear cliente
   */
  public createCustomer(event): void {
    this.showModalCrearCliente = false;
    this.cliente = event;
    this.nombreCompleto = event.primerNombre + ' ' + event.segundoNombre + ' ' + event.primerApellido + ' ' + event.segundoApellido;
  }

  /**
   * Metodo que es invocado por el modal de crear cliente
   */
  public closeModal(event): void {
    this.showModalCrearCliente = event;
  }

  /**
   * Metodo que permite soporta el evento click de las loteria a seleccionar
   */
  public seleccionarLoteria(loteria: LoteriaVirtualConfiguracionDTO): void {
    this.loteriaSeleccionada = loteria;
  }

  /**
   * Metodo que permite soporta el evento click agregar loterias
   */
  public agregarLoteria(): void {
    this.loteriasAgregadas.push('1');
  }

  /**
   * Metodo que es invocado al momento de la creacion
   * del componente, donde se procede a consultar los
   * datos iniciales requeridos de la funcionalidad
   */
  private init(): void {
    this.loterias = new Array<LoteriaVirtualConfiguracionDTO>();
    const loteria1 = new LoteriaVirtualConfiguracionDTO();
    loteria1.nombreLoteria = 'Quindio';
    loteria1.id = 1;
    const loteria2 = new LoteriaVirtualConfiguracionDTO();
    loteria2.nombreLoteria = 'Pereira';
    loteria2.id = 2;
    const loteria3 = new LoteriaVirtualConfiguracionDTO();
    loteria3.nombreLoteria = 'Manizales';
    loteria3.id = 3;
    const loteria4 = new LoteriaVirtualConfiguracionDTO();
    loteria4.nombreLoteria = 'Medellin';
    loteria4.id = 4;
    const loteria5 = new LoteriaVirtualConfiguracionDTO();
    loteria5.nombreLoteria = 'Bogota';
    loteria5.id = 5;
    this.loterias.push(loteria1);
    this.loterias.push(loteria2);
    this.loterias.push(loteria3);
    this.loterias.push(loteria4);
    this.loterias.push(loteria5);
    this.loteriasOrigen = this.loterias;
    this.loteriasAgregadas = new Array<string>();

    // se configura los items para tipo de documentos
    this.tipoDocumento = TiposDocumentosConstant.CEDULA_CIUDADANIA;
    this.itemsTiposDocumentos = [
      { value: TiposDocumentosConstant.CEDULA_CIUDADANIA, label: TiposDocumentosConstant.CEDULA_CIUDADANIA},
      { value: TiposDocumentosConstant.TARJETA_IDENTIDAD, label: TiposDocumentosConstant.TARJETA_IDENTIDAD}
    ];
  }
}
