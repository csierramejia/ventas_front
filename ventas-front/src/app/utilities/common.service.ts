import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ItemFiltroDTO } from '../dtos/transversal/item-filtro.dto';
import { ItemParamDTO } from '../dtos/transversal/item-param.dto';
import { CommonAPIConstant } from '../constants/apis/common/common-api-constant';

/**
 * Service que contiene los procesos de negocio comunes del sistema
 */
@Injectable()
export class CommonService {
  /**
   * @param HTTP para hacer las peticiones a los servicios REST
   */
  constructor(private http: HttpClient) {}

  /**
   * Servicio que permite obtener varios selectitems dependiendo de los parametros
   * @param params, contiene los datos de los parametros de los items a consultar
   *
   * @return, multiple de selecitems de varias tablas diferentes
   */
  public getSelectItems(params: Array<ItemParamDTO>): Observable<Array<ItemParamDTO>> {
    return this.http.post<Array<ItemParamDTO>>(
      CommonAPIConstant.URL_GET_SELECT_ITEMS,
      params
    );
  }
}
