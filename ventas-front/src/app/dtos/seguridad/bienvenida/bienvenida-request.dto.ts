/**
 * DTO que contiene los datos del REQUEST de bienvenida
 */
export class BienvenidaRequestDTO {

    /** identificador del Usuario autenticado en el sistema */
    public idUsuario: number;

    public idAplicacion: number;

    /** Oficina a la que está asociado el usuario */
    public idOficina: number;

    /** Punto de venta al que está asociado el usuario*/
    public idPuntoVenta: number;

    /** Indica si el usuario autenticado tiene rol de administrador */
	public administrador: boolean;
	
}
