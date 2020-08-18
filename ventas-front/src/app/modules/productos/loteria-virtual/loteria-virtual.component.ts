import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonComponent } from 'src/app/utilities/common.component';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { SpinnerState } from 'src/app/states/spinner.state';
import { TiposDocumentosConstant } from 'src/app/constants/tipos-documentos.constant';
import { ClientesDTO } from 'src/app/dtos/productos/chance/clientes.dto';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { ProductosService } from '../../../modules/productos/productos.service';
import { CrearClienteComponent } from '../chance/crear-cliente/crear-cliente.component';
import { LoteriaVirtualDTO } from 'src/app/dtos/productos/loteria-virtual/loteria-virtual.dto';
import { FiltroBusquedaDTO } from 'src/app/dtos/transversal/filtro-busqueda.dto';
import { CommonService } from 'src/app/utilities/common.service';
import { ItemParamDTO } from 'src/app/dtos/transversal/item-param.dto';
import { ItemFiltroDTO } from 'src/app/dtos/transversal/item-filtro.dto';
import { TipoItemConstant } from 'src/app/constants/tipo-item.constant';

/**
 * Componente para las ventas de las loterias virtual
 */
@Component({
  templateUrl: './loteria-virtual.component.html',
  styleUrls: ['./loteria-virtual.component.css'],
  providers: [ ProductosService, CommonService ]
})
export class LoteriaVirtualComponent extends CommonComponent implements OnInit, OnDestroy {

  /** Son las loterias habilitadas para su respectiva venta */
  public loterias: Array<LoteriaVirtualDTO>;

  /** DTO para encapsular los valores de los filtros de busqueda */
  public filtro: FiltroBusquedaDTO;

  /** Bandera que se utiliza para identificar si hay filtro busqueda aplicado */
  public hayFiltroAplicado: boolean;

  /** Se utiliza para mostrar la fecha-hora actual */
  public fechaActual = new Date();

  /** Es la loteria seleccionada para el proceso */
  public loteriaSeleccionada: LoteriaVirtualDTO;

  /** Son las loterias agregadas para pagar */
  public loteriasAgregadas: Array<string>;

  /** lista de items de TIPOS DE DOCUMENTOS */
  public itemsTiposDocumentos: SelectItem[];

  /** Datos del cliente consultado */
  public cliente: ClientesDTO;

  /** Se utiliza para visualizar el modal de creacion del cliente */
  public showModalCrearCliente: boolean;

  /** Es la cantidad de nro de card que se visualiza en el carousel */
  public carouselNroVisible = 3;

  /** Es el porcentaje del IVA a cobrar */
  public PORCENTAJE_IVA: number;

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
    private commonService: CommonService,
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
   * Metodo que permite obtener las loterias habilitadas para su venta
   */
  public getLoteriasVirtual(): void {

    // se limpia por si hay consultas anteriores
    this.loterias = null;

    // se limpia los espacios en blanco para el filtro nombre
    this.filtro.nombre = this.setTrimFilter(this.filtro.nombre);

    // se procede a consultar las loterias con sorteos disponibles
    this.productosService.getLoteriasVirtual(this.filtro).subscribe(
      data => {

        // se configura las loterias consultadas
        this.loterias = data;

        // se verifica si hay filtro aplicado
        this.hayFiltroAplicado = false;
        if (this.filtro.nombre) {
          this.hayFiltroAplicado = true;
        }

        // se configura el nro de card a visualizar en el carousel
        this.carouselNroVisible = 1;
        if (this.loterias && this.loterias.length === 2) {
          this.carouselNroVisible = 2;
        } else if (this.loterias && this.loterias.length > 2) {
          this.carouselNroVisible = 3;
        }
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }

  /**
   * Metodo que soporta el evento onchange del tipo y nro documento
   */
  public changeTipoNroDocumento(): void {

    // por si fue consultado con anterioridad
    this.showModalCrearCliente = false;
    this.cliente.idCliente = null;

    // se verifica la nulalidad de nro y tipo doc
    if (this.cliente.tipoDocumento && this.cliente.numeroDocumento) {

      // se procede a consultar el cliente
      this.productosService.clienteApuesta(this.cliente).subscribe(
        data => {
          const responseCliente: any = data;
          if (responseCliente.existe) {
            this.cliente = data;
          } else {
            this.modalCrearCliente.clienteForm.get('tipoDocumento').setValue(this.cliente.tipoDocumento);
            this.modalCrearCliente.clienteForm.get('numeroDocumento').setValue(this.cliente.numeroDocumento);
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
    this.cliente.primerNombre = event.primerNombre;
    this.cliente.segundoNombre = event.segundoNombre;
    this.cliente.primerApellido = event.primerApellido;
    this.cliente.segundoApellido = event.segundoApellido;
    this.cliente.idCliente = event.idPersona;
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
  public seleccionarLoteria(loteria: LoteriaVirtualDTO): void {
    this.spinnerState.displaySpinner();
    setTimeout(() => {
      this.loteriaSeleccionada = loteria;
      this.spinnerState.hideSpinner();
    }, 200);
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

    // lista de fracciones agregados para su venta
    this.loteriasAgregadas = new Array<string>();

    // se utiliza para el filtro de busqueda de nombre
    this.filtro = new FiltroBusquedaDTO();

    // datos del cliente a comprar las fracciones
    this.cliente = new ClientesDTO();
    this.cliente.tipoDocumento = TiposDocumentosConstant.CEDULA_CIUDADANIA;

    // se configura los items para tipo de documentos
    this.itemsTiposDocumentos = [
      { value: TiposDocumentosConstant.CEDULA_CIUDADANIA, label: TiposDocumentosConstant.CEDULA_CIUDADANIA},
      { value: TiposDocumentosConstant.TARJETA_IDENTIDAD, label: TiposDocumentosConstant.TARJETA_IDENTIDAD}
    ];

    // se obtiene las loterias habilitadas para su venta
    this.getLoteriasVirtual();

    // Se consulta las constantes parametrizado en el sistema
    this.getParametros();
  }

  /**
   * Metodo que permite consultar el porcentaje IVA
   */
  private getParametros(): void {

    // lista que contiene todos los parametros
    const params: Array<ItemParamDTO> = new Array<ItemParamDTO>();

    // parametros para obtener el IVA
    const filtro = new ItemFiltroDTO();
    filtro.nombre = 'IVA';
    const paramImpuesto: ItemParamDTO = new ItemParamDTO();
    paramImpuesto.tipoItem = TipoItemConstant.IMPUESTOS;
    paramImpuesto.filtro = filtro;
    params.push(paramImpuesto);

    // se hace el llamado al servicio
    this.commonService.getSelectItems(params).subscribe(
      (data) => {

        // se verifica si el servicio retorno algun valor
        if (data && data.length) {

          // se recorre cada item consultado
          for (const item of data) {

            // se verifica que tipo de selecitem se debe configurar
            switch (item.tipoItem) {
              case TipoItemConstant.IMPUESTOS: {
                this.PORCENTAJE_IVA = +item.items[0].label;
                break;
              }
            }
          }
        }
      },
      (error) => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }
}
