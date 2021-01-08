import { environment } from '../../../environments/environment';
/**
 * Clase constante que contiene todos los dominios que utiliza app
 */
var AppDomainConstant = /** @class */ (function () {
    function AppDomainConstant() {
    }
    /** Dominio del gateway */
    AppDomainConstant.URI_GATEWAY = environment.serverApiUrl;
    return AppDomainConstant;
}());
export { AppDomainConstant };
