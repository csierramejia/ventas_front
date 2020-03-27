/**
 * Clase constante que contiene todos los dominios que utiliza app
 */
export class AppDomainConstant {

  /** Dominio para consumir los recursos de los microservicios de seguridad */
  static readonly SEGURIDAD: string = 'http://localhost:8089/';

  /** Dominio para consumir los recursos de los microservicios de escrutinio */
  static readonly ESCRUTINIO: string = 'http://localhost:8088/';

  /** Dominio para consumir los recursos de los microservicios de aministracion */
  static readonly ADMINISTRACION: string = 'http://localhost:8087/';
  
    /** Dominio para consumir los recursos de los microservicios de apuestas */
  static readonly APUESTAS: string = 'http://localhost:8090/';
}
