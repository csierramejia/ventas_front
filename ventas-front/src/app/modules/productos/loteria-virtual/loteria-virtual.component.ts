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
import { LoteriaVirtualVentaDTO } from 'src/app/dtos/productos/loteria-virtual/loteria-virtual-venta.dto';
import { LoteriaVirtualVentaDetalleDTO } from 'src/app/dtos/productos/loteria-virtual/loteria-virtual-venta-detalle.dto';
import { MsjFrontConstant } from 'src/app/constants/messages-frontend.constant';
import { RegexUtil } from 'src/app/utilities/regex-util';

/**
 * Componente para las ventas de las loterias virtual
 */
@Component({
  templateUrl: './loteria-virtual.component.html',
  styleUrls: ['./loteria-virtual.component.css'],
  providers: [ ProductosService, CommonService ]
})
export class LoteriaVirtualComponent extends CommonComponent implements OnInit, OnDestroy {

  /** Contiene todos los datos de la venta */
  public venta: LoteriaVirtualVentaDTO;

  /** Contiene el detalle de la venta para ser agregado al carrito */
  public detalleVenta: LoteriaVirtualVentaDetalleDTO;

  /** Son los sorteos disponibles para la venta */
  public sorteos: Array<LoteriaVirtualDTO>;

  /** DTO para encapsular los valores de los filtros de busqueda */
  public filtro: FiltroBusquedaDTO;

  /** Bandera que se utiliza para identificar si hay filtro busqueda aplicado */
  public hayFiltroAplicado: boolean;

  /** Se utiliza para mostrar la fecha-hora actual */
  public fechaActual = new Date();

  /** Es el sorteo seleccionado para la venta */
  public sorteoSeleccionado: LoteriaVirtualDTO;

  /** lista de items de TIPOS DE DOCUMENTOS */
  public itemsTiposDocumentos: SelectItem[];

  /** Datos del cliente consultado */
  public cliente: ClientesDTO;

  /** Se utiliza para visualizar el modal de creacion del cliente */
  public showModalCrearCliente: boolean;

  /** Es la cantidad de nro de card que se visualiza en el carousel */
  public carouselNroVisible = 3;

  /** Indica si dio submit al momento verificar si la serie y nro son disponibles */
  public isSubmit: boolean;

  /** Son las fracciones disponible del sorteo a jugar */
  public fraccionesDisponible: Array<number>;

  /** Es el porcentaje del IVA a cobrar */
  private PORCENTAJE_IVA: number;

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
   * Metodo que soporta el evento click del boton pagar
   */
  public comprarLoteriaVirtual(): void {

    // se verifica que si hay venta para la compra
    if (this.venta && this.venta.detalles && this.venta.detalles.length) {

      // se verifica si el cliente fue seleccionado
      if (!this.cliente || !this.cliente.idCliente) {
        this.messageService.add(MsjUtil.getToastErrorMedium('Seleccione el cliente quién hace la compra'));
        return;
      }

      // se muestra la ventan de confirmacion
      this.confirmationService.confirm({
      message: '¿Está seguro que desea hacer la compra?',
      header: MsjFrontConstant.CONFIRMACION,
      accept: () => {

        }
      });
    }
  }

  /**
   * Metodo que permite obtener los sorteos habilitados para la venta
   */
  public getLoteriasVirtual(): void {

    // se limpia por si hay consultas anteriores
    this.sorteos = null;

    // se limpia los espacios en blanco para el filtro nombre
    this.filtro.nombre = this.setTrimFilter(this.filtro.nombre);

    // se procede a consultar las loterias con sorteos disponibles
    this.productosService.getLoteriasVirtual(this.filtro).subscribe(
      data => {

        // se configura las loterias consultadas
        this.sorteos = data;

        // se verifica si hay filtro aplicado
        this.hayFiltroAplicado = false;
        if (this.filtro.nombre) {
          this.hayFiltroAplicado = true;
        }

        // se configura el nro de card a visualizar en el carousel
        this.carouselNroVisible = 1;
        if (this.sorteos && this.sorteos.length === 2) {
          this.carouselNroVisible = 2;
        } else if (this.sorteos && this.sorteos.length > 2) {
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
   * Metodo que permite soporta el evento click para seleccionar el sorteo
   */
  public seleccionarSorteo(sorteo: LoteriaVirtualDTO): void {
    this.spinnerState.displaySpinner();
    setTimeout(() => {
      this.sorteoSeleccionado = sorteo;
      this.detalleVenta.idSorteo = sorteo.idSorteo;
      this.fraccionesDisponible = null;
      this.detalleVenta.fracciones = null;
      this.spinnerState.hideSpinner();
    }, 200);
  }

  /**
   * Metodo que permite agregar la apuesta al carrito de compra
   */
  public agregarApuestaCarritoCompra(): void {

    // se verifica si se ya seleccionaron las fracciones
    if (this.detalleVenta.fracciones && this.detalleVenta.fracciones > 0) {

      // se verifica que la serie y el nro no esten en el carrito venta
      if (this.venta.detalles.length) {
        for (const detalle of this.venta.detalles) {
          if (detalle.idSorteo === this.detalleVenta.idSorteo &&
              detalle.serie === this.detalleVenta.serie &&
              detalle.numero === this.detalleVenta.numero) {
            this.messageService.add(MsjUtil.getToastErrorLng('La serie y el número ya se encuentran agregado al carrito'));
            return;
          }
        }
      }

      // se muestra el mensaje de confirmacion
      this.confirmationService.confirm({
        message: '¿Está seguro de agregar el número al carrito?',
        header: MsjFrontConstant.CONFIRMACION,
        accept: () => {

          // se configuran los valores de la venta
          this.detalleVenta.nombreLoteria = this.sorteoSeleccionado.nombreLoteria;
          this.detalleVenta.numeroSorteo = this.sorteoSeleccionado.numeroSorteo;
          this.detalleVenta.valor = this.detalleVenta.fracciones * this.sorteoSeleccionado.valorFraccion;
          this.venta.valorTotal = this.venta.valorTotal + this.detalleVenta.valor;
          this.venta.valorTotalIVA = (this.venta.valorTotal * this.PORCENTAJE_IVA) / 100;
          this.detalleVenta.todoBillete = false;
          if (this.sorteoSeleccionado.cantidadFraccion === this.detalleVenta.fracciones) {
            this.detalleVenta.todoBillete = true;
          }

          // se agrega el detalle a la venta
          this.venta.detalles.push(this.detalleVenta);

          // se limpia las variable del detalle
          this.detalleVenta = new LoteriaVirtualVentaDetalleDTO();
          this.fraccionesDisponible = null;
          this.sorteoSeleccionado = null;

          // se reinicio el submit
          this.isSubmit = false;
          this.spinnerState.displaySpinner();
          setTimeout(() => {
            this.spinnerState.hideSpinner();
          }, 100);
        }
      });
    } else {
      this.messageService.add(MsjUtil.getToastErrorLng('Seleccione la cantidad de fracciones a jugar'));
    }
  }

  /**
   * Permite validar si la serie y el nro estan disponibles
   */
  public validarSerieNroDisponible(): void {

    // si consultaron con anterioridad
    this.fraccionesDisponible = null;
    this.detalleVenta.fracciones = null;

    // el sorteo es obligatorio
    if (!this.sorteoSeleccionado) {
      this.messageService.add(MsjUtil.getToastError('Seleccione el sorteo a jugar'));
      return;
    }

    // se indica que ya se dio submit
    this.isSubmit = true;

    // la serie y el nro son requeridos
    if (this.detalleVenta.serie && this.detalleVenta.numero) {

      // el nro de la serie es solo numerico
      if (!RegexUtil.isValorNumerico(this.detalleVenta.serie)) {
        this.messageService.add(MsjUtil.getToastErrorMedium(RegexUtil.getMsjSoloNumeros('La serie apostar')));
        return;
      }

      // el numero es solo numerico
      if (!RegexUtil.isValorNumerico(this.detalleVenta.numero)) {
        this.messageService.add(MsjUtil.getToastErrorMedium(RegexUtil.getMsjSoloNumeros('El número apostar')));
        return;
      }

      // el nro de la serie debe contener 3 digitos
      if (this.detalleVenta.serie.length < 3) {
        this.messageService.add(MsjUtil.getToastErrorMedium('La serie debe contener mínimo 3 dígitos'));
        return;
      }

      // el numero debe contener 4 digitos
      if (this.detalleVenta.numero.length < 4) {
        this.messageService.add(MsjUtil.getToastErrorMedium('El número debe contener mínimo 4 dígitos'));
        return;
      }

      // se procede a consultar la disponibilidad de la serie y el numero
      this.productosService.getFraccionesDisponiblesNumeroLoteria(this.detalleVenta).subscribe(
        data => {

          // se verifica si hay disponibilidad para la serie y el numero
          if (data && data.fracciones) {

            // se configura las fracciones disponibles
            this.fraccionesDisponible = new Array<number>();
            let i = 1;
            while (i <= data.fracciones) {
              this.fraccionesDisponible.push(i);
              i++;
            }

            // se configura las fracciones vendidas para la serie y el numero
            this.detalleVenta.fraccionesVendidas = data.fraccionesVendidas;
          } else {
            this.messageService.add(MsjUtil.getToastErrorLng('La serie y el número son invalidos para el sorteo seleccionado'));
          }
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
    }
  }

  /**
   * Permite generar una serie y un numero valido aleatorio
   */
  public generarNumeroAleatorio(): void {

    // si consultaron con anterioridad
    this.fraccionesDisponible = null;
    this.detalleVenta.fracciones = null;

    // el sorteo es obligatorio
    if (!this.sorteoSeleccionado) {
      this.messageService.add(MsjUtil.getToastError('Seleccione el sorteo a jugar'));
      return;
    }

    // se procede a consultar una serie y un numero aleatorio
    this.productosService.getSerieNumeroAleatorio(this.detalleVenta).subscribe(
      data => {

        // se verifica si hay disponibilidad para la serie y el numero
        if (data && data.fracciones) {

          // se configura las fracciones disponibles
          this.fraccionesDisponible = new Array<number>();
          let i = 1;
          while (i <= data.fracciones) {
            this.fraccionesDisponible.push(i);
            i++;
          }

          // se configura los valores generados aleatorios
          this.detalleVenta.fraccionesVendidas = data.fraccionesVendidas;
          this.detalleVenta.serie = data.serie;
          this.detalleVenta.numero = data.numero;
        } else {
          this.messageService.add(MsjUtil.getToastErrorLng('No hay números habilitados para el sorteo seleccionado'));
        }
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }

  /**
   * Metodo que es invocado cuando cambian el valor de la serie y nro
   */
  public changeSerieNumero(): void {
    this.fraccionesDisponible = null;
    this.detalleVenta.fracciones = null;
  }

  /**
   * Metodo que soporta el evento click de las fracciones
   */
  public setCantidadFracciones(cantidad: number): void {
    this.spinnerState.displaySpinner();
    setTimeout(() => {
      this.detalleVenta.fracciones = cantidad;
      this.spinnerState.hideSpinner();
    }, 100);
  }

  /**
   * Metodo que es invocado al momento de la creacion
   * del componente, donde se procede a consultar los
   * datos iniciales requeridos de la funcionalidad
   */
  private init(): void {

    // DTO que contiene todos los datos de la venta
    this.venta = new LoteriaVirtualVentaDTO();
    this.venta.valorTotal = 0;
    this.venta.valorTotalIVA = 0;
    this.venta.detalles = new Array<LoteriaVirtualVentaDetalleDTO>();

    // DTO que contiene el detalle de la venta
    this.detalleVenta = new LoteriaVirtualVentaDetalleDTO();

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
   * Metodo que permite consultar los parametros necesarios para esta funcionalidad
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
