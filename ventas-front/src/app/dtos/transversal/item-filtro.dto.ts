/**
 * DTO que contiene los atributos de los filtros
 * para obtener los items del sistema
 */
export class ItemFiltroDTO {

    /** Filtro por estado del item */
    public estado: string;
  
    /** Filtro por id rol */
    public filtroIdRol: string;
  
    /** Filtro por id empresa */
    public filtroIdEmpresa: string;
  
    /** Filtro por id usuario */
    public filtroIdUsuario: number;

    /** Filtro por id usuario */
    public filtroidProducto: number;
  
    /** Filtro para consultar solo los recursos padres */
    public soloRecursosPadre: boolean;
  
    /** Filtro por tipos de fabricantes, ids tipos fabricantes separados por coma 1,2 */
    public tiposFabricantes: string;
  }
  