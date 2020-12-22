import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ItemParamDTO } from '../dtos/transversal/item-param.dto';
import { CommonAPIConstant } from '../constants/apis/common/common-api-constant';
import { Subject } from 'rxjs/Subject';

/**
 * Service que contiene los procesos de negocio comunes del sistema
 */
@Injectable()
export class CommonService {

  public stringSubject = new Subject<string>();

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


  obtenerHora(): Observable<Date>{

    return new Observable(
        observer => {
              setInterval(() =>
                  observer.next(new Date())
              , 1000);
        }
    );
  }


  passValue(data) {
    //passing the data as the next observable
    this.stringSubject.next(data);
  }

  /**
   * servicio qeu retorne la hora y fecha de la base de datos
   * 
   */
}
