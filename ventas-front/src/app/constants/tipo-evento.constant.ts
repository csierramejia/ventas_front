/**
 * Clase que contiene los tipos de eventos (ACTUALIZAR, DELETE, ACTIVAR etc)
 */
export class TipoEventoConstant {
  static readonly CREAR: string = 'C';
  static readonly EDITAR: string = 'A';
  static readonly ELIMINAR: string = 'E';
  static readonly ACTIVAR: string = 'AC';
  static readonly INACTIVAR: string = 'IN';
  static readonly GET: string = 'GET';
  static readonly SET: string = 'SET';
}
