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
import { VentanaModalModel } from 'src/app/model-component/ventana-modal.model';
import { FechaUtil } from 'src/app/utilities/fecha-util';
import { NotificacionSoportePagoDTO } from 'src/app/dtos/correos/notificacion-soporte-pago.dto';
import { AutenticacionResponseDTO } from 'src/app/dtos/seguridad/autenticacion/autenticacion-response.dto';
import { SessionStoreUtil } from 'src/app/utilities/session-store.util';
import { TipoEventoConstant } from 'src/app/constants/tipo-evento.constant';
import { TipoTransaccionConstants } from 'src/app/constants/tipo-transaccion-constants';

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

  /** Son las fracciones disponible para la edicion */
  public fraccionesDisponibleEdicion: Array<number>;

  /** Se utiliza para visualizar el modal de edicion */
  public modalEdicion: VentanaModalModel;

  /** Es la cantidad de fracciones a editar */
  public fraccionesEdicion: number;

  /** Es el porcentaje del IVA a cobrar */
  private PORCENTAJE_IVA: number;

  /** Dto que contiene los datos de la autenticacion */
  private auth: AutenticacionResponseDTO;

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

      // se muestra la ventan de confirmacion
      this.confirmationService.confirm({
      message: '¿Está seguro que desea hacer la compra?',
      header: MsjFrontConstant.CONFIRMACION,
      accept: () => {

        // se procede a realizar la venta
        this.venta.idCliente = this.cliente.idCliente;
        this.venta.idUsuario = this.auth.usuario.idUsuario;
        this.venta.canal = 1;
        this.productosService.comprarLoteriaVirtual(this.venta).subscribe(
          data => {
              // se muestra el mensaje exitoso
              this.messageService.add(MsjUtil.getToastSuccessMedium('La compra fue registrada exitosamente'));

              // se procede a enviar el soporte de pago
              if (this.cliente && this.cliente.correo) {
                const notificacion = new NotificacionSoportePagoDTO();
                notificacion.idUsuario = this.auth.usuario.idUsuario;
                notificacion.correoDestino = this.cliente.correo;
                notificacion.nroTransaccion = data.nroTransaccion;
                notificacion.soportePagoLoteriaVirtual = data.soportePagoLoteriaVirtual;
                notificacion.tipoTransaccion = TipoTransaccionConstants.LOTERIA_VIRTUAL;
                notificacion.totalPagadoSinIva = this.venta.valorTotal - this.venta.valorTotalIVA;
                notificacion.valorTotalIVA = this.venta.valorTotalIVA;
                this.enviarNotificacionSoportePago(notificacion);
              }

              // se inicializa los datos de la venta
              this.venta = new LoteriaVirtualVentaDTO();
              this.venta.valorTotal = 0;
              this.venta.valorTotalIVA = 0;
              this.venta.detalles = new Array<LoteriaVirtualVentaDetalleDTO>();
              this.detalleVenta = new LoteriaVirtualVentaDetalleDTO();
            },
            error => {
              this.messageService.add(MsjUtil.getMsjError(error.error.mensaje));
              this.messageService.add(MsjUtil.getToastErrorLng(error.error.mensaje));
            }
          );
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

        // se configura la fecha del sorteo formato colombiano
        if (this.sorteos && this.sorteos.length) {
          for (const sorteo of this.sorteos) {
            sorteo.fechaSorteo = FechaUtil.stringToDate(sorteo.fechaSorteo.toString());
          }
        }
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
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
            this.detalleVenta.fraccionesDisponibles = data.fracciones;
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
          this.detalleVenta.fraccionesDisponibles = data.fracciones;
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
    this.cliente.correo = event.correo;
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

      // por si hay datos consultados con anterioridad
      this.fraccionesDisponible = null;
      this.detalleVenta.fracciones = null;
      this.detalleVenta.serie = null;
      this.detalleVenta.numero = null;
      this.isSubmit = false;

      // se configura los datos del sorteo seleccionado
      this.sorteoSeleccionado = sorteo;
      this.detalleVenta.idSorteo = sorteo.idSorteo;

      // se configura el rango inicial y final
      let inicial = sorteo.rangoInicialSerie.toString();
      if (inicial.length === 1) {
        inicial = '00' + inicial;
      } else if (inicial.length === 2) {
        inicial = '0' + inicial;
      }
      let final = sorteo.rangoFinalSerie.toString();
      if (final.length === 1) {
        final = '00' + final;
      } else if (final.length === 2) {
        final = '0' + final;
      }
      this.sorteoSeleccionado.rangoSerie = '( ' + inicial + ' - ' + final + ' )';
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
          this.detalleVenta.valorFraccion = this.sorteoSeleccionado.valorFraccion;
          this.detalleVenta.cantidadFracciones = this.sorteoSeleccionado.cantidadFraccion;
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
   * Metodo que soporta el evento click de las fracciones
   */
  public setCantidadFraccionesEdicion(cantidad: number): void {
    this.spinnerState.displaySpinner();
    setTimeout(() => {
      this.fraccionesEdicion = cantidad;
      this.spinnerState.hideSpinner();
    }, 100);
  }

  /**
   * Metodo que soporta el evento click de las fracciones
   */
  public eliminarNumeroCarrito(detalle: LoteriaVirtualVentaDetalleDTO): void {

    // se muestra la ventana de confirmacion
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar el número:' + detalle.numero + '?',
      header: MsjFrontConstant.CONFIRMACION,
      accept: () => {

        // se elimina el detalle de la venta
        const i = this.venta.detalles.indexOf(detalle, 0);
        if (i > -1) {
          this.venta.detalles.splice(i, 1);
        }

        // se calculan los valores de la venta
        this.venta.valorTotal = this.venta.valorTotal - detalle.valor;
        this.venta.valorTotalIVA = (this.venta.valorTotal * this.PORCENTAJE_IVA) / 100;
        this.spinnerState.displaySpinner();
        setTimeout(() => {
          this.spinnerState.hideSpinner();
        }, 100);
      }
    });
  }

  /**
   * Metodo que soporte el evento click del boton edicion
   */
  public showModalEdicion(detalle: LoteriaVirtualVentaDetalleDTO): void {

    // se visualiza el modal
    if (!this.modalEdicion) {
      this.modalEdicion = new VentanaModalModel();
    }
    this.modalEdicion.showModal(detalle);

    // se configura las fracciones disponible
    this.fraccionesEdicion = detalle.fracciones;
    this.fraccionesDisponibleEdicion = new Array<number>();
    let i = 1;
    while (i <= detalle.fraccionesDisponibles) {
      this.fraccionesDisponibleEdicion.push(i);
      i++;
    }
  }

  /**
   * Metodo que permite aplicar los cambios del modal edicion
   */
  public aplicarCambios(): void {

    // solo aplica si hay cambios
    if (this.hayCambiosAplicados()) {
      this.spinnerState.displaySpinner();
      setTimeout(() => {

        // se descuenta el valor anterior
        this.venta.valorTotal = this.venta.valorTotal - this.modalEdicion.data.valor;

        // se configura la nueva fracciones
        this.modalEdicion.data.fracciones = this.fraccionesEdicion;

        // se calcula el nuevo valor
        this.modalEdicion.data.valor = this.modalEdicion.data.fracciones * this.modalEdicion.data.valorFraccion;

        // se calcula el valor total del IVA
        this.venta.valorTotal = this.venta.valorTotal + this.modalEdicion.data.valor;
        this.venta.valorTotalIVA = (this.venta.valorTotal * this.PORCENTAJE_IVA) / 100;

        // se verifica si escogieron todo el billete
        this.modalEdicion.data.todoBillete = false;
        if (this.modalEdicion.data.cantidadFracciones === this.fraccionesEdicion) {
          this.modalEdicion.data.todoBillete = true;
        }

        // se limpia las variabes globales
        this.modalEdicion.closeModal();
        this.fraccionesEdicion = null;
        this.fraccionesDisponibleEdicion = null;
        this.spinnerState.hideSpinner();
      }, 100);
    }
  }

  /**
   * Metodo que permite validar si hay cambios aplicados
   */
  public hayCambiosAplicados(): boolean {
    if (this.modalEdicion &&
        this.modalEdicion.data &&
        this.modalEdicion.data.fracciones !== this.fraccionesEdicion) {
      return true;
    }
    return false;
  }

  /**
   * Metodo que es invocado al momento de la creacion
   * del componente, donde se procede a consultar los
   * datos iniciales requeridos de la funcionalidad
   */
  private init(): void {

    // se obtiene los datos de la autenticacion
    this.auth = SessionStoreUtil.auth(TipoEventoConstant.GET);

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

  /**
   * Permite enviar la notificacion de soporte de pago
   */
  private enviarNotificacionSoportePago(data: NotificacionSoportePagoDTO): void {
    this.productosService.enviarNotificacionSoportePagoChance(data).subscribe(
      (response) => {},
      (error) => { this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error))); }
    );
  }
}
