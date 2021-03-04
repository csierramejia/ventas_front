import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LoteriasDTO } from 'src/app/dtos/escrutinio/loterias/loterias.dto';
import { ClientesDTO } from 'src/app/dtos/productos/chance/clientes.dto';
import { PersonaDTO } from 'src/app/dtos/productos/chance/persona.dto';
import { ImpuestosDTO } from 'src/app/dtos/productos/chance/impuestos.dto';
import { ProductosAPIConstant } from 'src/app/constants/apis/productos/productos-api.constant';
import { ResponseDTO } from 'src/app/dtos/productos/chance/response.dto';
import { FiltroBusquedaDTO } from 'src/app/dtos/transversal/filtro-busqueda.dto';
import { LoteriaVirtualDTO } from 'src/app/dtos/productos/loteria-virtual/loteria-virtual.dto';
import { LoteriaVirtualVentaDetalleDTO } from 'src/app/dtos/productos/loteria-virtual/loteria-virtual-venta-detalle.dto';
import { MessageResponseDTO } from 'src/app/dtos/transversal/message-response.dto';
import { LoteriaVirtualVentaDTO } from 'src/app/dtos/productos/loteria-virtual/loteria-virtual-venta.dto';
import { NotificacionSoportePagoDTO } from 'src/app/dtos/correos/notificacion-soporte-pago.dto';
import { CorreosAPIConstant } from 'src/app/constants/apis/correos/correos-api-constant';
import { LoteriaVirtualVentaResponseDTO } from 'src/app/dtos/productos/loteria-virtual/loteria-virtual-venta-response.dto';
import { FiltroOperacionDTO } from 'src/app/dtos/transversal/filtro-operacion.dto';
import { RolloColillaDTO} from 'src/app/dtos/transversal/rollo-colilla.dto'
import { PapeleriaRolloDTO } from 'src/app/dtos/transversal/papeleria-rollo.dto';


/**
 * Service que contiene los procesos de negocio para la Loterias en el sistema
 */
@Injectable()
export class ProductosService {
  /**
   * @param HTTP para hacer las peticiones a los servicios REST
   */
  constructor(private http: HttpClient) { }

  /**
   * @author Luis Hernandez
   * @param fechaSorteoFilter
   * @description Metodo que devuelve las loterias habilitadas para el sorteo de la fecha seleccionada
   */
  public consultarLoterias(fechaSorteoFilter, idProducto): Observable<LoteriasDTO[]> {
    const v = encodeURI(JSON.stringify({fechaSorteo: fechaSorteoFilter,producto:idProducto }));
    return this.http.get<LoteriasDTO[]>(`${ProductosAPIConstant.URL_CONSULTAR_LOTERIAS}/${v}`);
  }

  public consultarSignos() :Observable<any[]> {
    return this.http.get<any[]>(`${ProductosAPIConstant.URL_CONSULTAR_SIGNOS}`);
  }

  public consultarPaquetes() :Observable<any[]> {
    return this.http.get<any[]>(`${ProductosAPIConstant.URL_CONSULTAR_PAQUETES}`);
  }

  public consultarOperadores() :Observable<any[]> {
    return this.http.get<any[]>(`${ProductosAPIConstant.URL_CONSULTAR_OPERADORES}`);
  }

  public consultarNumeroSerieApuesta(nombreProducto:string) :Observable<any> {
    return this.http.get<any>(`${ProductosAPIConstant.URL_CONSULTAR_SERIE_APUESTAS}/${nombreProducto}`);
  }


  public consultarSemanaServidor() :Observable<any[]> {
    return this.http.get<any[]>(`${ProductosAPIConstant.URL_CONSULTAR_SEMANA}`);
  }

  public consultarValoresModalidad(nombreProducto:string, idModalidad:number): Observable<number[]> {
    return this.http.get<number[]>(`${ProductosAPIConstant.URL_CONSULTAR_MODALIDADES_VALORES}/${nombreProducto}/${idModalidad}`);
  }


  /**
   * @author Luis Hernandez
   * @param cliente
   * @description funcion que hace la peticion de validación de existencia de un cliente
   */
  public clienteApuesta(cliente: ClientesDTO): Observable<ClientesDTO> {
    return this.http.get<ClientesDTO>(`${ProductosAPIConstant.URL_CONSULTAR_CLIENTE}/${cliente.numeroDocumento}/${cliente.tipoDocumento}`);
  }


  /**
   * @author Luis Hernandez
   * @param iva
   * @description Metodo que trae del back la información del iva a aplicar
   */
  public consultarIva(iva): Observable<ImpuestosDTO> {
    return this.http.get<ImpuestosDTO>(`${ProductosAPIConstant.URL_IMPUESTO_IVA}/${iva}`);
  }


  /**
   * @author Luis Hernandez
   * @param iva
   * @description Metodo que envia la transacción de pago de apuesta
   */
  public registrarRecarga(bet): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(
      ProductosAPIConstant.URL_REGISTRAR_RECARGA,
      bet
    );
  }

  public registrarApuesta(bet): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(
      ProductosAPIConstant.URL_REGISTRAR_APUESTA,
      bet
    );
  }


  public registrarApuestas(bet): Observable<ResponseDTO> {
    console.log('----------');
    console.log(ProductosAPIConstant.URL_REGISTRAR_APUESTAS)
    console.log('----------');
    return this.http.post<ResponseDTO>(
      ProductosAPIConstant.URL_REGISTRAR_APUESTAS,
      bet
    );
  }


  /**
   * @author Luis Hernandez
   * @param cliente
   * @description Metodo que se encarga de enviar
   * los datos para la creacion de un cliente
   */
  public registrarCliente(cliente): Observable<PersonaDTO> {
    return this.http.post<PersonaDTO>(
      ProductosAPIConstant.URL_REGISTRAR_CLIENTE,
      cliente
    );
  }

  public consultarRutaImagenes(): Observable<any> {
    return this.http.get<any>(`${ProductosAPIConstant.URL_CONSULTAR_RUTA_IMAGENES}`);
  }

  /**
   * Servicio que permite consultar las loterias virtual
   * que estan habilitados para su respectiva venta
   */
  public getLoteriasVirtual(filtro: FiltroBusquedaDTO): Observable<Array<LoteriaVirtualDTO>> {
    return this.http.post<Array<LoteriaVirtualDTO>>(ProductosAPIConstant.URL_GET_LOTERIAS_VIRTUAL, filtro);
  }

  /**
   * Servicio que permite obtener la cantidad de fracciones disponibles
   * para la venta de un numero + serie de la loteria virtual
   */
  public getFraccionesDisponiblesNumeroLoteria(venta: LoteriaVirtualVentaDetalleDTO): Observable<LoteriaVirtualVentaDetalleDTO> {
    return this.http.post<LoteriaVirtualVentaDetalleDTO>(ProductosAPIConstant.URL_GET_FRACCIONES_DISPONIBLES, venta);
  }

  /**
   * Servicio que permite consultar una serie + numero aleatorio que este disponible
   */
  public getSerieNumeroAleatorio(venta: LoteriaVirtualVentaDetalleDTO): Observable<LoteriaVirtualVentaDetalleDTO> {
    return this.http.post<LoteriaVirtualVentaDetalleDTO>(ProductosAPIConstant.URL_GET_NUMERO_ALEATORIO, venta);
  }

  /**
   * Servicio que permite realizar la compra de una loteria virtual
   */
  public comprarLoteriaVirtual(venta: LoteriaVirtualVentaDTO): Observable<LoteriaVirtualVentaResponseDTO> {
    return this.http.post<LoteriaVirtualVentaResponseDTO>(ProductosAPIConstant.URL_GET_COMPRAR_LOTERIA_VIRTUAL, venta);
  }

  /**
   * Servicio para la notificacion de soporte de pago
   */
  public enviarNotificacionSoportePagoChance(data: NotificacionSoportePagoDTO): Observable<MessageResponseDTO> {
    return this.http.post<MessageResponseDTO>(
      CorreosAPIConstant.URL_NOTIFICAR_SOPORTE_PAGO,
      data
    );
  }

  /**
   * Método que permite consultar la vigencia de prorgamción del vendedor
   * @param idUsuario 
   */
  public consultarProgramacion(idUsuario): Observable<boolean> {
    return this.http.post<boolean>(
      ProductosAPIConstant.URL_EXISTE_PROGRAMACION,
      idUsuario
    );
  }

  /**
   * Método encargado de consultar el número en que va la colilla
   * @param filtro 
   */
  public consultarColilla(filtro: FiltroOperacionDTO): Observable<RolloColillaDTO> {
    return this.http.post<RolloColillaDTO>(
      ProductosAPIConstant.URL_COLILLA_ROLLO,
      filtro
    );
  }


   /**
   * Método encargado de obtner la lista de rollos asociados a un vendedor
   * @param idVendedor 
   * @return DTO con los datos de los rollos
   */
  public obtenerSeriesVendedor(idVendedor: number): Observable<PapeleriaRolloDTO[]> {
    return this.http.post<PapeleriaRolloDTO[]>(
      ProductosAPIConstant.URL_SERIES_VENDEDOR,
      idVendedor
    );
  }

  


}
