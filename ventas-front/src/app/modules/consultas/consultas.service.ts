import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ConsultasService {

  /**
   * @param HTTP para hacer las peticiones a los servicios REST
   */
  constructor(private http: HttpClient) { }



  //   /**
  //  * Servicio que soporta el proceso de negocio para
  //  * obtener los ROLES parametrizados en el sistema
  //  */
  // public consultaMovimientos(filtro: FiltroBusquedaDTO): Observable<PaginadorResponseDTO> {
  //   return this.http.post<PaginadorResponseDTO>(
  //     AdministracionAPIConstant.URL_GET_ROLES,
  //     filtro
  //   );
  // }

}
