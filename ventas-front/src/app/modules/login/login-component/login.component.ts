import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstant } from './../../../constants/router.constant';
import { AutenticacionRequestDTO } from 'src/app/dtos/seguridad/autenticacion/autenticacion-request.dto';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { BienvenidaRequestDTO } from 'src/app/dtos/seguridad/bienvenida/bienvenida-request.dto';
import { SeguridadService } from '../seguridad.service';

/**
 * Componente para la autenticacion del sistema ADMIN
 */
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [SeguridadService]
})
export class LoginComponent extends CommonComponent implements OnInit {

  /** Se utiliza para capturar las credenciales del usuario */
  public credenciales: AutenticacionRequestDTO;

  /** Contiene el mensaje de error presentada en la autenticacion */
  public msjError: string;

  /**
   * @param shellState, se utiliza para notificar el inicio de sesion
   * @param SeguridadService, contiene los servicios para la autenticacion
   * @param router, Router para la navegacion a la pagina bienvenida
   */
  constructor(
    private shellState: ShellState,
    private seguridadService: SeguridadService,
    private router: Router) {
    super();
  }

  /**
   * Aca se debe inicializar las variables globales del LOGIN
   */
  ngOnInit() {
    this.init();
  }

  /**
   * Metodo que soporta el evento click del boton iniciar sesion
   */
  public iniciarSesion(formLogin): void {

    // se valida la nulalidad de las credenciales
    if (this.credenciales && this.credenciales.claveIngreso && this.credenciales.usuarioIngreso) {

      // se procede a iniciar sesion en el sistema
      this.seguridadService.iniciarSesion(this.credenciales).subscribe(
        dataAutenticacion => {

          // se procede a obtener lo datos de bienvenida de la app
          const request: BienvenidaRequestDTO = new BienvenidaRequestDTO();
          request.idUsuario = dataAutenticacion.usuario.idUsuario;
          request.idAplicacion = 2;
          this.seguridadService.getDatosBienvenida(request).subscribe(
            dataBienvenida => {
              // se indica el shell que hay un nuevo inicio de sesion
              this.shellState.iniciarSesion(dataBienvenida, dataAutenticacion);
            },
            error => {
              this.showError(error, formLogin);
            }
          );
        },
        error => {
          this.showError(error, formLogin);
        }
      );
    }
  }

  /**
   * Metodo que es ejecutado antes de invocar el metodo iniciar sesion
   */
  public beforeIniciarSesion(): boolean {
    this.msjError = null;
    return true;
  }

  /**
   * Metodo que permite inicializar las variables globales
   */
  private init(): void {
    this.credenciales = new AutenticacionRequestDTO();
  }

  /**
   * Metodo que permite mostrar el error al momento consumir una API
   */
  private showError(error, formLogin): void {
    this.msjError = this.showMensajeError(error);
    this.credenciales.claveIngreso = null;
    formLogin.submitted = false;
  }
}
