/**
 * DTO para encapsular los datos que se envia desde el cliente
 * (angular, app movil) al momento de la autenticacion del sistema
 */
export class AutenticacionRequestDTO {

    /** Es la clave de ingreso al sistema */
    public claveIngreso: string;

    /** Es el usuario de ingreso al sistema */
    public usuarioIngreso: string;
}
