/**
 * DTO que representa la información 
 * de las colillas usadas para ventas
 *
 */
export class RolloColillaDTO {
   /** Es la serie de la papeleria caja */
	public serie: string;

	/** Numero inicial de la serie **/
	public nroInicialSerie: number;

	/** Numero final de la serie **/
	public nroFinalSerie: number;

	/** Rango inicial de la serie */
	public rangoColilla: string;
	
	/** Numero de colilla en el que va la venta */
	public colillaActual : number;
}