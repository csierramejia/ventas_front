import { ConsultasAPIConstant } from './../../constants/apis/consultas/consultas-api-constant';
import { PaginadorResponseDTO } from './../../dtos/transversal/paginador-response.dto';
import { FiltroBusquedaDTO } from './../../dtos/consultas/consulta-movimientos/filtro-busqueda.dto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ConsultasService {

  /**
   * @param HTTP para hacer las peticiones a los servicios REST
   */
  constructor(private http: HttpClient) { }

  /**
   * Servicio que soporta el proceso de negocio para
   * obtener los ROLES parametrizados en el sistema
   */
  public consultaMovimientos(filtro: FiltroBusquedaDTO): Observable<PaginadorResponseDTO> {
    return this.http.post<PaginadorResponseDTO>(
      ConsultasAPIConstant.URL_CONSULTAR_MOVIMIENTOS,
      filtro
    );
  }

}
