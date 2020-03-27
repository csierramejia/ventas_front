import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { VentasService } from '../ventas.service';

import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { EmpresasResponsetDTO } from 'src/app/dtos/seguridad/empresas/empresas-response.dto';
import { ProductosResponsetDTO } from 'src/app/dtos/seguridad/productos/productos-response.dto';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { MsjFrontConstant } from '../../../constants/messages-frontend.constant';
/**
 * Componente para la autenticacion del sistema ADMIN
 */
@Component({
  templateUrl: './chance.component.html',
  styleUrls: ['./chance.component.css'],
  providers: [VentasService]
})
export class ChanceComponent extends CommonComponent implements OnInit, OnDestroy {

  msjError:string;
  estados:SelectItem[];
  rows:number;
  constructor(
    private shellState: ShellState,
    private loteriasService: VentasService,
    private router: Router,
    protected messageService: MessageService) {
    super();
    this.rows=10;
  }

  /**
   * Aca se debe inicializar las variables globales
   */
  ngOnInit() {
    this.shellState.title.titulo = "Chance";
    this.init();
    this.estados = [
      {label: 'Activo', value: 'ACTIVO'},
      {label: 'Inactivo', value: 'INACTIVO'}
  ];
  }

  verFiltros(){

  }

  consultar(){

  }

  crear(){
    
  }
  /**
   * Metodo que permite inicializar las variables globales
   */
  private init(): void {
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

