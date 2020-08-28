import { environment } from '../../../environments/environment';
/**
 * Clase constante que contiene todos los dominios que utiliza app
 */
export class AppDomainConstant {

  /** Dominio del gateway */
  static readonly URI_GATEWAY: string = environment.serverApiUrl;
}
