import { PaginadorDTO } from '../dtos/transversal/paginador.dto';
import { PaginadorResponseDTO } from '../dtos/transversal/paginador-response.dto';
import { PaginadorConstant } from '../constants/paginador-constant';

/**
 * Clase que contiene el modelo del paginador, se debe utilizar
 * esta clase para las consultas masivas del sistema que se
 * muestran en un p-table
 */
export class PaginadorModel {
         /** son los registros a visualizar por pantalla */
         public registros: any;

         /** son los datos del paginador */
         public datos: PaginadorDTO;

         /** Es la instancia del componente que tiene el metodo paginar para ser invocado */
         public listener: any;

         /** Es el nro de filas por paginas por default */
         public rowsDefault: number;

         /** son las opciones para el tamanio de cada pagina (10,20,30,40,50) */
         public rowsPerPageOptions: Array<number>;

         /** son las opciones para el tamanio de cada pagina (10,50,100,150,200) */
         public rowsPerPageOptionsMovimientos: Array<number>;

         /** Es la parte inferior que se muestra del paginador (1-10 de 300) */
         public pageReport: string;

         /**
          * @param listener , Es la instancia del componente que
          * tiene el metodo filtrar para ser invocado
          */
         constructor(listener: any) {
           // se configura el listener
           this.listener = listener;

           // se crea el DTO donde contiene los atributos del paginador
           this.datos = this.initPaginadorDTO();

           // se configura la cantidad de filas por default
           this.rowsDefault = +PaginadorConstant.ROWS_PAGE_DEFAULT;

           // se configura las opciones que tiene el paginador
           this.rowsPerPageOptions = PaginadorConstant.ROWS_PER_PAGE_OPTIONS;

           // se configura las opciones que tiene el paginador
           this.rowsPerPageOptionsMovimientos = PaginadorConstant.ROWS_PER_PAGE_OPTIONS_MOVIENTOS;
         }

         /**
          * Este metodo es invocado cuando cambian la pagina o el select que
          * contiene la lista de opciones de cantidad de filas por pagina
          */
         public scrollerListener(event): void {
           // se obtiene skip y filas por paginas del paginador
           const first = event.first + '';
           const rows = event.rows + '';

           // se hace el llamado al paginar cuando pase alguno de los siguientes criterios
           // 1- cuando el usuario no seleccione la misma pagina
           // 2- cuando el usuario cambio el valor filas por paginas
           if (this.datos.skip !== first || this.datos.rowsPage !== rows) {
             // se configura el numero por paginas dado que puede llegar valores diferentes
             this.datos.rowsPage = rows;

             // se configura el skip para consultar paginado
             this.datos.skip = first;

             // se invoca el metodo paginar del listener
             this.listener.paginar();

             // se configura el page report del paginador
             this.setPageReport();
           }
         }

         /**
          * Metodo que permite configurar lo registros consultados
          */
         public configurarRegistros(response: PaginadorResponseDTO): void {
           // si la cantidad de registro es nulo es porque se reinicio el paginador
           // se procede a configurar la cantidad total registros y sus registros
           this.registros = response.registros;
           if (!this.datos.cantidadTotal) {
             this.datos.cantidadTotal = response.cantidadTotal;
           }
         }

         /**
          * Metodo que se debe invocar antes de filtrar,
          * permite crear el backup de los datos del paginador
          */
         public filtroBefore(): PaginadorDTO {
           const datosPaginador = this.initPaginadorDTO();
           datosPaginador.rowsPage = this.datos.rowsPage;
           return datosPaginador;
         }

         /**
          * Metodo que se debe invocar cuando el filtro de busqueda
          * no presento ningun error, configurando los datos del
          * response y reiniciando la tabla
          */
         public filtroExitoso(
           table: any,
           response: PaginadorResponseDTO
         ): void {
           // se reinicia p-table
           table.reset();

           // se reinicia los datos del paginador, esto con el fin que se vea reflejado
           // en la vista los nuevos registros de acuerdo al nuevo filtro busqueda
           this.datos.skip = PaginadorConstant.SKIP_DEFAULT;
           this.datos.cantidadTotal = null;
           this.registros = null;

           // se configura la cantidad total con sus registros
           this.configurarRegistros(response);

           // se configura el page report del paginador
           this.setPageReport();
         }

         /**
          * Metodo que permite crear una instancia de los datos del paginador
          */
         private initPaginadorDTO(): PaginadorDTO {
           const datosPaginador = new PaginadorDTO();
           datosPaginador.rowsPage = PaginadorConstant.ROWS_PAGE_DEFAULT;
           datosPaginador.skip = PaginadorConstant.SKIP_DEFAULT;
           datosPaginador.cantidadTotal = null;
           return datosPaginador;
         }

         /**
          * Permite configurar el page report que se muestra en el paginador
          */
         private setPageReport(): void {
           const first = this.datos.skip === '0' ? '1' : +this.datos.skip + 1;
           const total = +this.datos.skip + +this.datos.rowsPage;
           const last =
             total > this.datos.cantidadTotal
               ? this.datos.cantidadTotal
               : total;
           this.pageReport =
             first + ' - ' + last + ' de ' + this.datos.cantidadTotal;
         }
       }
