/**
 * DTO para encapsular los datos personales del usuario para la autenticacion
 */
export class UsuarioDTO {

    /** identificador del Usuario */
    public idUsuario: number;

    /** Es el primer nombre del usuario */
    public primerNombre: string;

    /** Es el segundo nombre del usuario */
    public segundoNombre: string;

    /** Es el primer apellido del usuario */
    public primerApellido: string;

    /** Es el segundo apellido del usuario */
    public segundoApellido: string;

    /** Oficina a la pertenece el usuario */
    public idOficina: number;

    /** Punto de venta al que pertenece el usuario */
    public idPuntoVenta: number;
}
