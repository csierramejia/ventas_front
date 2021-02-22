/**
 * DTO que representa la información 
 * de las series de papelería
 *
 */
export class PapeleriaRolloDTO {
   	/** Identificador de la papeleria por CAJA */
	public idCaja: number;

	/** Identificador de la papeleria por ROLLO */
	public idRollo: number;

	/** Es la serie de la papeleria caja */
	public serie: string;

	/** Numero inicial de la serie **/
	public nroInicialSerie: number;

	/** Numero final de la serie **/
	public nroFinalSerie: number;

	/** Rango inicial de la serie */
	public rangoInicial: string;

	/** Rango final de la serie */
    public rangoFinal: string;
    
    /** Identificador del tipo de papeleria */
	public idTipoPapeleria: number;

	/** Nombre del tipo de papeleria */
	public nombreTipoPapeleria: string;
      
}