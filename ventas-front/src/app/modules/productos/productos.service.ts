import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LoteriaProductosDTO } from 'src/app/dtos/escrutinio/loterias/loterias-productos.dto';
import { LoteriasDTO } from 'src/app/dtos/escrutinio/loterias/loterias.dto';
import { ProductosAPIConstant } from 'src/app/constants/apis/productos/productos-api.constant';
// import { EmpresasResponsetDTO } from 'src/app/dtos/seguridad/empresas/empresas-response.dto';
// import { ProductosResponsetDTO } from 'src/app/dtos/seguridad/productos/productos-response.dto';
// import { FiltrosSorteoDTO } from 'src/app/dtos/escrutinio/numeroganador/filtros-sorteo.dto';
// import { SorteosLoteriaDTO } from 'src/app/dtos/escrutinio/numeroganador/sorteo-loterias.dto';
// import { FiltroCalendarioSorteoDTO } from 'src/app/dtos/escrutinio/calendario-sorteos/filtro-calendario-sorteo.dto';
// import { PaginadorResponseDTO } from 'src/app/dtos/transversal/paginador-response.dto';

/**
 * Service que contiene los procesos de negocio para la Loterias en el sistema
 */
@Injectable()
export class ProductosService {

  /**
   * @param HTTP para hacer las peticiones a los servicios REST
   */
  constructor(private http: HttpClient) { }


  // public consultarLoterias(filtros: LoteriaProductosDTO): Observable<LoteriasDTO[]> {
  public consultarLoterias(): Observable<LoteriasDTO[]> {
    // const loteriasRequestDTO = Object.assign({}, filtros);
     return this.http.get<LoteriasDTO[]>('http://localhost:8088/loterias/consultarLoterias/{}');
    //  const loteriasRequestDTO = Object.assign({}, filtros);

    // const v = encodeURI(JSON.stringify({fechaSorteo: '2020-04-07'}));

    // return this.http.get<LoteriasDTO[]>('http://localhost:8086/apuesta/consultarLoteriasSorteo/'+ v);
    // return this.http.get<LoteriasDTO[]>(`${ProductosAPIConstant.URL_CONSULTAR_LOTERIAS}/${JSON.stringify(loteriasRequestDTO)}`
    // );
     // return this.http.get<LoteriasDTO[]>(`${ProductosAPIConstant.URL_CONSULTAR_LOTERIAS}/${JSON.stringify(loteriasRequestDTO)}`
    // );
  }

}
