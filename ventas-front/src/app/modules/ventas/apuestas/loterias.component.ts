import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { EscrutinioService } from '../ventas.service';
import { LoteriaProductosDTO } from 'src/app/dtos/escrutinio/loterias/loterias-productos.dto';
import { LoteriasDTO } from 'src/app/dtos/escrutinio/loterias/loterias.dto';
import { EmpresaProductoLoteriaDTO } from 'src/app/dtos/escrutinio/loterias/empresa-producto-loteria.dto';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { EmpresasResponsetDTO } from 'src/app/dtos/seguridad/empresas/empresas-response.dto';
import { ProductosResponsetDTO } from 'src/app/dtos/seguridad/productos/productos-response.dto';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { MsjFrontConstant } from '../../../constants/messages-frontend.constant';
/**
 * Componente para la autenticacion del sistema ADMIN
 */
@Component({
  templateUrl: './loterias.component.html',
  styleUrls: ['./loterias.component.css'],
  providers: [EscrutinioService]
})
export class LoteriasComponent extends CommonComponent implements OnInit, OnDestroy {
  msjError: string;
  mostrarFiltros: boolean;
  mostrarCrear: boolean;
  filtros: LoteriaProductosDTO;
  loteriaEntrada: LoteriaProductosDTO;
  loterias: LoteriasDTO[];
  empresas: EmpresasResponsetDTO[];
  empresaSeleccionada:EmpresasResponsetDTO;
  productos: ProductosResponsetDTO[];
  empresasProductosLoterias:EmpresaProductoLoteriaDTO[];
  productosSeleccionados: ProductosResponsetDTO[];
  estadoActivo: boolean;
  estadoInactivo: boolean;
  estados:SelectItem[];
  esEdicion: boolean;
  mostrarProductos: boolean;
  esAgregado: boolean;
  modalProductos:boolean;
  rows:number;
  constructor(
    private shellState: ShellState,
    private loteriasService: EscrutinioService,
    private router: Router,
    protected messageService: MessageService) {
    super();
    this.rows=10;
  }

  /**
   * Aca se debe inicializar las variables globales
   */
  ngOnInit() {
    this.shellState.title.titulo = "Loterías";
    this.init();
    this.consultar();
    this.consultarEmpresas();
    this.estados = [
      {label: 'Activo', value: 'ACTIVO'},
      {label: 'Inactivo', value: 'INACTIVO'}
  ];
  }


  /**
   * Metodo que permite inicializar las variables globales
   */
  private init(): void {
    this.empresasProductosLoterias=[];
    this.modalProductos=false;
    this.mostrarFiltros = false;
    this.mostrarCrear = false;
    this.loteriaEntrada = new LoteriaProductosDTO();
    this.filtros = new LoteriaProductosDTO();
    this.loterias = [];
    this.estadoActivo = false;
    this.estadoInactivo = false;
    this.esEdicion = false;
    this.mostrarProductos = false;
  }

  consultarEmpresas() {
    this.loteriasService.consultarEmpresas().subscribe(
      empresasData => {
        this.empresas = empresasData;
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }

  consultarProductosPorEmpresa(idEmpresa, indicador) {
    this.mostrarProductos = false;
    if (idEmpresa) {
      this.loteriasService.consultarProductosPorEmpresa(idEmpresa).subscribe(
        productosData => {
          this.mostrarProductos = true;
          this.productos = productosData;
          if (indicador) {
            this.productosSeleccionados = [];
            //agrego los seleccionados en la creacion para la edicion
            this.productos.forEach(pro => {
              pro.seleccionado = false;
              this.loteriaEntrada.empresasProductosLoterias.forEach(p => {
                if (pro.idProducto == p.idProducto) {
                  pro.seleccionado = true;
                  this.productosSeleccionados.push(pro);
                }
              });

            });

          }
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
    }
  }
  seleccionProducto(producto) {
    this.esAgregado = true;
    if (this.esEdicion) {
      this.productosSeleccionados.forEach(element => {
        if (element.idProducto == producto.idProducto) {
          element.seleccionado = false;
        }
        else {
          producto.seleccionado = true;
          this.productosSeleccionados.push(producto);
        }
        this.esAgregado = false;
      });
    }
    else {
      this.productosSeleccionados.forEach(element => {
        if (element.idProducto == producto.idProducto) {
          this.productosSeleccionados.splice(producto);
        }
        else {
          producto.seleccionado = true;
          this.productosSeleccionados.push(producto);
        }
        this.esAgregado = false;
      });
    }
    if (this.esAgregado) {
      producto.seleccionado = true;
      this.productosSeleccionados.push(producto);
    }
  }
  seleccionarRadio(event: any){
    this.loteriaEntrada.idEstado=event.target.value;
  }

  editarLoteria(loteria): void {
    this.empresaSeleccionada=new EmpresasResponsetDTO();
    this.empresaSeleccionada.idEmpresa=loteria.idEmpresa;
    this.mostrarCrear = true;
    this.mostrarProductos = true;
    this.esEdicion = true;
    this.loteriaEntrada = loteria;
    if (this.loteriaEntrada.idEstado == 'ACTIVO') {
      this.estadoActivo = true;
      this.estadoInactivo = false;
    }
    else if (this.loteriaEntrada.idEstado == 'INACTIVO') {
      this.estadoInactivo = true;
      this.estadoActivo = false;
    }
    else {
      this.estadoInactivo = false;
      this.estadoActivo = false;
    }
    //aca se deben consultar la lista de productos asociados a la empresa q se esta editando
    this.consultarProductosPorEmpresa(loteria.idEmpresa, true);
  }

  consultar(): void {
    this.loteriasService.consultarLoterias(this.filtros).subscribe(
      loteriasData => {
        this.loterias = loteriasData;
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }

  cerrarModal(): void{
    this.modalProductos=false;
  }
  guardarLoteria(formLogin): void {
    if(formLogin.invalid){
      return;
    }
    if(this.empresaSeleccionada == null || this.empresaSeleccionada==undefined ||
      this.empresaSeleccionada.idEmpresa==null){
        this.messageService.add(MsjUtil.getToastErrorLng(MsjFrontConstant.NO_SELECCION_EMPRESA));
        return
    }
    this.loteriaEntrada.idEmpresa=this.empresaSeleccionada.idEmpresa;
    if(this.productosSeleccionados == null || this.productosSeleccionados==undefined
      || this.productosSeleccionados.length == 0){
        //muestro mensaje
        this.messageService.add(MsjUtil.getToastErrorLng(MsjFrontConstant.PRODUCTOS_POR_LOTERIAS));
        return
    }
    this.loteriaEntrada.productos = this.productosSeleccionados;
    this.loteriasService.crearLoteria(this.loteriaEntrada).subscribe(
      loteriasData => {
        if(this.esEdicion){
        this.messageService.add(MsjUtil.getToastSuccessLng(MsjFrontConstant.EXITO_ACTUALIZACION_LOTERIAS));
        }
        else{
          this.messageService.add(MsjUtil.getToastSuccessLng(MsjFrontConstant.EXITO_CREACION_LOTERIAS));
        }
        this.loteriaEntrada = loteriasData;
        this.init();
        this.consultar();
      },
      error => {
        this.showErrorDos(error,formLogin);
      }
    );
  }

  cancelar(): void {
    this.modalProductos=false;
    this.mostrarCrear = false;
    this.mostrarFiltros = false;
    this.esEdicion = false;
    this.estadoInactivo = false;
    this.estadoActivo = false;
    this.loteriaEntrada = new LoteriaProductosDTO();
  }

  crearLoteria(): void {
    this.productosSeleccionados = [];
    this.mostrarCrear = true;
    this.estadoInactivo = false;
    this.estadoActivo = false;
    this.loteriaEntrada = new LoteriaProductosDTO();
    this.mostrarProductos=false;
  }
  limpiarFiltros(): void {
    this.filtros = new LoteriaProductosDTO();
  }
  verFiltros(): void {
    if (this.mostrarFiltros) {
      this.mostrarFiltros = false;
    }
    else {
      this.mostrarFiltros = true;
    }

  }
  verProductos(row){
   this.empresasProductosLoterias=row.empresasProductosLoterias;
    this.modalProductos=true;
  }

  /**
   * Metodo que permite mostrar el error al momento consumir una API
   */
  private showError(error): void {
    this.msjError = this.showMensajeError(error);
  }

  public beforeCrear(): boolean {
    this.msjError = null;
    return true;
  }

  private showErrorDos(error, formLogin): void {
    this.msjError = this.showMensajeError(error);
    formLogin.submitted = false;
  }

  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
    this.shellState.title.clear();
  }
}

