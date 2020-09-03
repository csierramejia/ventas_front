import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ConsultasService } from './../consultas.service';
import { CommonComponent } from 'src/app/utilities/common.component';
import { SpinnerState } from './../../../states/spinner.state';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/utilities/common.service';
import { FiltroBusquedaDTO } from './../../../dtos/consultas/consulta-movimientos/filtro-busqueda.dto';
import { PaginadorModel } from './../../../model-component/paginador-model';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { TipoEventoConstant } from 'src/app/constants/tipo-evento.constant';
import { SessionStoreUtil } from 'src/app/utilities/session-store.util';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { LabelsConstant } from 'src/app/constants/labels.constant';
import { TipoItemConstant } from './../../../constants/tipo-item.constant';
import { EstadosConstant } from './../../../constants/estados.constant';
import { ItemFiltroDTO } from './../../../dtos/transversal/item-filtro.dto';
import { ItemParamDTO } from './../../../dtos/transversal/item-param.dto';
import { AutenticacionResponseDTO } from 'src/app/dtos/seguridad/autenticacion/autenticacion-response.dto';
import { FechaUtil } from 'src/app/utilities/fecha-util';


@Component({
  selector: 'app-consulta-movimientos',
  templateUrl: './consulta-movimientos.component.html',
  styleUrls: ['./consulta-movimientos.component.css'],
  providers: [ConsultasService, CommonService],
})
export class ConsultaMovimientosComponent extends CommonComponent
  implements OnInit, OnDestroy {
  /** constante para el idioma espaniol para los calendar */
  public CALENDAR_SPANISH = LabelsConstant.CALENDAR_SPANISH;

  /** Modelo del paginador con los datos de los ROLES del sistema */
  public movimientos: PaginadorModel;

  /** DTO para encapsular los valores de los filtros de busqueda */
  public filtro: FiltroBusquedaDTO;

  /** DTO para encapsular los valores de los filtros de busqueda ingresados */
  public filtroClone: FiltroBusquedaDTO;

  /** Bandera que indica si el panel del filtro esta visible */
  public isShowFilter: boolean;

  /** Bandera que se utiliza para identificar si hay un primer filtro aplicado  */
  public hayPrimerFiltro: boolean;

  /** lista de items de EMPRESAS */
  public itemsProductos: SelectItem[];

  /** lista de items de EMPRESAS */
  public itemsTiposReporte: SelectItem[];

  /** variable que almacena el valor de la suma de los movimientos */
  public sumValTotal: number;

  /** Dto que contiene los datos de la autenticacion */
  private auth: AutenticacionResponseDTO;

  /** Se utiliza para resetear la tabla de roles cuando aplican un filtro */
  @ViewChild('tblmovimientos') tblmovimientos: Table;

  constructor(
    protected messageService: MessageService,
    private consultasService: ConsultasService,
    private confirmationService: ConfirmationService,
    private spinnerState: SpinnerState,
    private commonService: CommonService
  ) {
    super();
  }

  ngOnInit(): void {
    // bandera para visualizar el panel de filtro
    this.isShowFilter = true;

    // se configura el modelo del paginador de los ROLES
    this.movimientos = new PaginadorModel(this);

    // se configuran los atributos que soporta el proceso de filtros busqueda
    this.hayPrimerFiltro = false;
    this.filtroClone = new FiltroBusquedaDTO();
    this.filtro = new FiltroBusquedaDTO();

    // se obtiene los datos de la autenticacion
    this.auth = SessionStoreUtil.auth(TipoEventoConstant.GET);

    // se procede a consultar los items de productos y tipos reporte
    this.getSelectItems();
  }

  ngOnDestroy(): void {}

  /**
   * Metodo que permite consultar todos los selectItems para esta funcionalidad
   */
  private getSelectItems(): void {
    // se crea las instancias de cada selectitem
    this.itemsProductos = [];
    this.itemsTiposReporte = [
      { value: 'Detallado', label: 'Detallado' },
      { value: 'Agrupado', label: 'Agrupado' },
    ];

   // this.filtro.tipoReporte = 'Detallado';
    // contiene todos los parametros de cada selectitems a consultar
    const params: Array<ItemParamDTO> = new Array<ItemParamDTO>();

    // parametro para consultar los items productos
    const paramTiposProductos: ItemParamDTO = new ItemParamDTO();
    paramTiposProductos.tipoItem = TipoItemConstant.PRODUCTOS;
    params.push(paramTiposProductos);

    // se procede a invocar el servicio para obtener todos los items
    this.commonService.getSelectItems(params).subscribe(
      (data) => {
        // se verifica si el servicio retorno algun valor
        if (data && data.length) {
          // se recorre cada item consultado
          for (const item of data) {
            //se verifica que tipo de selecitem se debe configurar
            switch (item.tipoItem) {
              case TipoItemConstant.PRODUCTOS: {
                this.itemsProductos = item.items;
                break;
              }
            }
          }
        }
      },
      (error) => {
        this.messageService.add(
          MsjUtil.getMsjError(this.showMensajeError(error))
        );
      }
    );
  }

  /**
   * Soporta el evento click del boton ocultar o mostrar filtro busqueda
   */
  public toogleShowFilter(): void {
    this.isShowFilter = !this.isShowFilter;
  }

  /**
   * Metodo que permite soportar el evento click del boton limpiar filtro
   */
  public limpiar(): void {
    this.filtro = new FiltroBusquedaDTO();
  }

  /**
   * Metodo que permite soportar el evento click del boton filtrar
   */
  public filtrar(): void {
    // se verifica si hay un nuevo filtro de busqueda ingresado
    this.filtro.id = this.auth.usuario.idUsuario;
    if (this.isNuevoFiltroBusqueda()) {
      // se hace el backup de los datos del paginador esto por si hay errores
      this.filtro.paginador = this.movimientos.filtroBefore();
      this.sumValTotal = 0;
      // se consultan las empresas de acuerdo a los filtros ingresados
      this.consultasService.consultaMovimientos(this.filtro).subscribe(
        (data) => {
          // se configuran los empresas consultados
          this.movimientos.filtroExitoso(this.tblmovimientos, data);
          this.calcularTolalValor();
          // se debe clonar los filtros asi evitar solicitudes si no hay nuevos criterios
          this.filtroClone = JSON.parse(JSON.stringify(this.filtro));
        },
        (error) => {
          this.messageService.add(
            MsjUtil.getMsjError(this.showMensajeError(error))
          );
        }
      );
    }
  }

  /**
   * Permite identificar si hay nuevo un criterio de busqueda ingresado
   */
  private isNuevoFiltroBusqueda(): boolean {
    // se verifica si es el primer filtro procesado
    if (!this.hayPrimerFiltro) {
      this.hayPrimerFiltro = true;
      return true;
    }
    // se valida cada criterio si hay alguna modificacion
    this.filtro.tipoReporte = this.setTrim(this.filtro.tipoReporte);
    if (
      this.filtro.idProductos !== this.filtroClone.idProductos ||
      !FechaUtil.iqualsDateFilter(this.filtroClone.fecha, this.filtro.fecha) ||
      this.filtro.tipoReporte !== this.filtroClone.tipoReporte
    ) {
      return true;
    }
    return false;
  }

  /**
   * Metodo que es invocado por el paginador de la tabla
   */
  public paginar(): void {
    // se limpia los mensajes anteriores
    this.messageService.clear();
    this.sumValTotal = 0;
    // se configura el paginador dado que puede cambiar el skip o rowsperpage
    this.filtroClone.paginador = this.movimientos.datos;

    // se procede a consultar los empresas
    this.consultasService.consultaMovimientos(this.filtroClone)
      .subscribe(
        (data) => {
          this.movimientos.configurarRegistros(data);
          this.calcularTolalValor();
        },
        (error) => {
          this.messageService.add(
            MsjUtil.getMsjError(this.showMensajeError(error))
          );
        }
      );
  }

  /**
   * Metodo para calcular el valor total de las ventas
   */
  calcularTolalValor() {
    let total = 0;
    if (this.movimientos.registros != null && this.movimientos.registros !== undefined) {
      for (const movimiento of this.movimientos.registros) {
          total += movimiento.valorTransaccion;
      }
    }

    this.sumValTotal = total;
}

}
