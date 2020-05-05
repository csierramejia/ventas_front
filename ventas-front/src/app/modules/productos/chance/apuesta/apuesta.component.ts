import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductosService } from '../../productos.service';
import { LoteriasDTO } from 'src/app/dtos/escrutinio/loterias/loterias.dto';
import { ClientesDTO } from 'src/app/dtos/productos/chance/clientes.dto';
import { MessageService } from 'primeng/api';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { CrearClienteComponent } from '../crear-cliente/crear-cliente.component';

@Component({
  selector: 'app-apuesta',
  templateUrl: './apuesta.component.html',
  styleUrls: ['./apuesta.component.css'],
  providers: [ProductosService]
})
export class ApuestaComponent extends CommonComponent implements OnInit, OnDestroy  {

  @Output() addBet: EventEmitter<any> = new EventEmitter();
  @Output() addLotteries: EventEmitter<any> = new EventEmitter();

  @ViewChild(CrearClienteComponent) crearClienteChild: CrearClienteComponent;

  pathLotteries = '../../../../../assets/img/loterias/';
  idCustomer = '';
  displayModalCreate = false;
  btnEdit = false;
  btnAdd  = true;
  idEdit: any;
  loterias: LoteriasDTO[];

  lotteriesSelected = [];

  dayBet: Date;
  viewLotteries = false;
  days = [
    { text: 'L', name: 'lun', date: null },
    { text: 'M', name: 'mar', date: null },
    { text: 'M', name: 'mie', date: null },
    { text: 'J', name: 'jue', date: null },
    { text: 'V', name: 'vie', date: null },
    { text: 'S', name: 'sab', date: null },
    { text: 'D', name: 'dom', date: null }
  ];

  enabledCustomer = false;
  // enabledCombined = false;
  enabledThree = true;
  enabledTwo = true;
  enabledOne = true;


  chanceForm = new FormGroup({
    fecha: new FormControl(''),
    numero: new FormControl('', [Validators.required]),
    tipoDocumento: new FormControl('', [Validators.required]),
    numeroDocumento: new FormControl('', [Validators.required]),
    nombreCliente: new FormControl(''),
    valorDirecto: new FormControl('', [Validators.required]),
    combinado: new FormControl(''),
    tresCifras: new FormControl(''),
    dosCifras: new FormControl(''),
    unaCifra: new FormControl(''),
  });

  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
    private shellState: ShellState
  ) {
    super();
    // obtemos el esquema de fechas para que el usuario puede saleccionar el dia de la apuesta a realizar
    const dayWeek = this.getDayWeek();
    this.setDays(dayWeek);
  }

  ngOnInit(): void {
  }

  /**
   * @author Luis Hernandez
   * @description Por medio de este metodo marcamos con color verde el dia de la apuesta y setiamos la fecha
   * @param day
   */
  get_date_bet(day) {
    this.dayBet = day.date;
    // colocamos color al dia seleccionamos y le quitamos a los demas
    this.days.forEach(element => {
      if (element.name === day.name) {
        const chip = document.getElementById(day.name);
        chip.style.backgroundColor = '#0083FE';
        chip.style.color = '#fff';
      } else {
        const chip = document.getElementById(element.name);
        chip.style.backgroundColor = '#FFFFFF';
        chip.style.color = '#0083FE';
      }
    });
    // llamamos el metodo que se encarga de consultar las loterias
    this.getLotteries();
  }

  /**
   * @author Luis Hernandez
   */
  getLotteries(): void {
      this.productosService.consultarLoterias(this.dayBet).subscribe(
        loteriasData => {
          this.loterias = loteriasData;
          this.viewLotteries = true;
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de validar si
   * existe o no el cliente, si este no existe se
   * levanta un popup para su posterior creación
   */
  validExistClient(): void {

    if (this.chanceForm.get('tipoDocumento').value && this.chanceForm.get('numeroDocumento').value) {
      const clientesDTO: ClientesDTO = new ClientesDTO();
      this.enabledCustomer = false;
      this.chanceForm.controls.nombreCliente.setValue('');
      clientesDTO.numeroDocumento = this.chanceForm.get('numeroDocumento').value;
      clientesDTO.tipoDocumento = this.chanceForm.get('tipoDocumento').value;
      this.productosService.clienteApuesta(clientesDTO).subscribe(
        clienteData => {
          const responseCliente: any = clienteData;
          if (responseCliente.existe) {
            const name = responseCliente.primerNombre + ' ' + responseCliente.segundoNombre + ' ' + responseCliente.primerApellido;
            this.idCustomer = responseCliente.idCliente;
            this.chanceForm.controls.nombreCliente.setValue(name);
            this.enabledCustomer = true;
          } else {
            this.crearClienteChild.clienteForm.get('tipoDocumento').setValue(this.chanceForm.get('tipoDocumento').value);
            this.crearClienteChild.clienteForm.get('numeroDocumento').setValue(this.chanceForm.get('numeroDocumento').value);
            this.displayModalCreate = true;
          }
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
    }

  }


  /**
   * @author Luis Hernandez
   * @description Metodo que devuelve un numero aleatorio de 3 cifras
   */
  getNumberThree(): void {
    this.chanceForm.controls.numero.setValue( Math.round(Math.random() * (100 - 999) + 999 ) );
    // this.validInputBet();
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que devuelve un numero aleatorio de 4 cifras
   */
  getNumberFour(): void {
    this.chanceForm.controls.numero.setValue(Math.round(Math.random() * (1000 - 9999) + 9999 ));
    // this.validInputBet();
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de
   * revisar si la cantidad de caracteres del
   * numero corresponde al minimo de numero
   * para realizar la apuesta y de esta manera
   * activar los demas campos
   */
  chanceNumber(): void {
    if (this.chanceForm.get('numero').value.length < 3) {
      this.enabledThree = false;
      this.enabledTwo = false;
      this.enabledOne = false;
    }
    // else {
    //   this.validInputBet();
    // }
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de aplicar reglas de negocio
   * de apuesta por el momento no se va a utilizar dado que indicaron
   * que las apuesta debe quedar abierta
   */
  validInputBet(): void {

    this.enabledThree = false;
    this.enabledTwo = false;
    this.enabledOne = false;

    this.chanceForm.get('tresCifras').setValue('');
    this.chanceForm.get('dosCifras').setValue('');
    this.chanceForm.get('unaCifra').setValue('');

    if (String(this.chanceForm.get('numero').value).length === 4) {
      if (this.chanceForm.get('combinado').value && !this.chanceForm.get('valorDirecto').value) {
        this.enabledThree = false;
        this.enabledTwo = false;
        this.enabledOne = false;
      } else {
        this.enabledThree = true;
        this.enabledTwo = true;
        this.enabledOne = true;
      }
    } else if (String(this.chanceForm.get('numero').value).length === 3) {
      if (this.chanceForm.get('valorDirecto').value && this.chanceForm.get('combinado').value) {
        this.enabledThree = false;
        this.enabledTwo = true;
        this.enabledOne = true;
      } else if (this.chanceForm.get('combinado').value && !this.chanceForm.get('valorDirecto').value) {
        this.enabledThree = false;
        this.enabledTwo = false;
        this.enabledOne = false;
      } else if (this.chanceForm.get('valorDirecto').value && !this.chanceForm.get('combinado').value) {
        this.enabledThree = false;
        this.enabledTwo = true;
        this.enabledOne = true;
      }
    }

  }


  /**
   * @author Luis Hernandez
   * @param event
   * @description Metodo que se encarga de
   * recibir el false que emite el componente
   * que contiene el html del fomulario de
   * creación (popup)
   */
  closeModal(event): void {
    this.displayModalCreate = event;
  }

  addBetSend(): void {
    if (this.valid()) {
      this.addBet.emit({
        action: 1,
        _id: 'bet_' + Math.floor(Math.random() * 999999),
        idCustomer: this.idCustomer,
        numberPlayed: this.chanceForm.get('numero').value,
        dataPlayed: this.dayBet,
        direct: this.chanceForm.get('valorDirecto').value,
        combined: this.chanceForm.get('combinado').value,
        threeC: this.chanceForm.get('tresCifras').value,
        twoC: this.chanceForm.get('dosCifras').value,
        oneC: this.chanceForm.get('unaCifra').value,
      });
      this.cleanInputs();
    } else {
      // alert('Usted debe diligenciar todos los campos');
      this.messageService.add(MsjUtil.getMsjError('Usted debe diligenciar todos los campos'));
    }
  }



  addLotteriesSend(): void {
      this.addLotteries.emit(this.lotteriesSelected);
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga
   * de enviar a la bolsa el producto modificado
   */
  editBetSend() {
    if (this.valid()) {
      this.addBet.emit({
        action: 0,
        _id: this.idEdit,
        documentCustomer: this.chanceForm.get('numeroDocumento').value,
        nameCustomer: this.chanceForm.get('nombreCliente').value,
        numberPlayed: this.chanceForm.get('numero').value,
        dataPlayed: this.dayBet,
        direct: this.chanceForm.get('valorDirecto').value,
        combined: this.chanceForm.get('combinado').value,
        threeC: this.chanceForm.get('tresCifras').value,
        twoC: this.chanceForm.get('dosCifras').value,
        oneC: this.chanceForm.get('unaCifra').value,
      });
      this.cleanInputs();
    } else {
      // alert('Usted debe diligenciar todos los campos');
      this.messageService.add(MsjUtil.getMsjError('Usted debe diligenciar todos los campos'));
    }
  }


  /**
   * @author Luis Hernandez
   * @param event
   * @description metodo que se encarga
   * de recibir los datos a editar y hace set
   */
  editBetSendEmit(event): void {
    this.idEdit = event._id;
    this.dayBet = event.dataPlayed;
    this.chanceForm.get('numeroDocumento').setValue(event.documentCustomer);
    this.chanceForm.get('numero').setValue(event.numberPlayed);
    this.chanceForm.get('valorDirecto').setValue(event.direct);
    if (event.nameCustomer) {
      this.chanceForm.get('nombreCliente').setValue(event.nameCustomer);
      this.enabledCustomer = true;
    }
    if (event.combined) {this.chanceForm.get('combinado').setValue(event.combined); }
    if (event.threeC) {this.chanceForm.get('tresCifras').setValue(event.threeC); }
    if (event.twoC) {this.chanceForm.get('dosCifras').setValue(event.twoC); }
    if (event.oneC) {this.chanceForm.get('unaCifra').setValue(event.oneC); }

    // regla de negocio que queda pendiente
    // this.validInputBet();

    this.btnAdd = false;
    this.btnEdit = true;
  }


  /**
   * @author Luis Hernandez
   * @param event
   * @description metodo que se da cuenta cuanto la transaccion fue ok
   */
  createBetSendEmit(event): void {
    if (event) {
      // limpiamos campos de información del cliente
      this.chanceForm.get('tipoDocumento').setValue('');
      this.chanceForm.get('numeroDocumento').setValue('');
      this.chanceForm.get('nombreCliente').setValue('');
      this.enabledCustomer = false;

      // quitamos fecha y loterias seleccionadas
      this.loterias = [];
      this.days.forEach(element => {
        const chip = document.getElementById(element.name);
        chip.style.backgroundColor = '#ffffff';
        chip.style.color = '#0083fe';
      });
      delete this.dayBet;
      // limpiamos los demas campos
      this.cleanInputs();
    }
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga
   * de validar que los campos obligatorios
   * esten diligenciados
   */
  valid() {
    if (
        this.chanceForm.get('numero').valid &&
        this.dayBet) {
          if (this.chanceForm.get('valorDirecto').valid || this.chanceForm.get('combinado').valid) {
            return true;
          } else {
            return false;
          }
    } else {
      return false;
    }
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de limpiar los campos
   */
  cleanInputs(): void {
    this.chanceForm.get('numero').setValue('');
    this.chanceForm.get('valorDirecto').setValue('');
    this.chanceForm.get('combinado').setValue('');
    this.chanceForm.get('tresCifras').setValue('');
    this.chanceForm.get('dosCifras').setValue('');
    this.chanceForm.get('unaCifra').setValue('');
    // this.enabledCombined = false;
    // this.enabledThree = false;
    // this.enabledTwo = false;
    // this.enabledOne = false;
    this.btnAdd = true;
    this.btnEdit = false;
  }


  /**
   * @author Luis Hernandez
   * @param event
   * @description Metodo que se encarga de recibir
   * el cliente creado y mostrarlo en pantalla
   */
  createCustomer(event): void {
    this.displayModalCreate = false;
    const name = event.primerNombre + ' ' + event.segundoNombre + ' ' + event.primerApellido;
    this.idCustomer = event.idPersona;
    this.chanceForm.controls.nombreCliente.setValue(name);
    this.enabledCustomer = true;
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que devuelve el
   * dia sobre el cual se esta operando
   */
  getDayWeek() {
    const hoy = new Date();
    const days = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
    const dt = new Date(hoy.getMonth() + 1 + ' ' + hoy.getDate() + ', ' + hoy.getFullYear() + ' 12:00:00');
    return days[dt.getUTCDay()];
  }


  /**
   * @author Luis Hernandez
   * @description setiamos la fecha de los
   * posibles dias de apuesta partiendo del
   * dia actual
   * @param dayWeek
   */
  setDays(dayWeek): void {
    const hoy = new Date();
    const dt = new Date(hoy.getMonth() + 1 + ' ' + hoy.getDate() + ', ' + hoy.getFullYear());
    switch (dayWeek) {
      case 'lun':
        this.days[0].date = dt;
        this.days[1].date = new Date(dt.getTime() + (1 * 24 * 60 * 60 * 1000));
        this.days[2].date = new Date(dt.getTime() + (2 * 24 * 60 * 60 * 1000));
        this.days[3].date = new Date(dt.getTime() + (3 * 24 * 60 * 60 * 1000));
        this.days[4].date = new Date(dt.getTime() + (4 * 24 * 60 * 60 * 1000));
        this.days[5].date = new Date(dt.getTime() + (5 * 24 * 60 * 60 * 1000));
        this.days[6].date = new Date(dt.getTime() + (6 * 24 * 60 * 60 * 1000));
        break;
      case 'mar':
        this.days[0].date = new Date(dt.getTime() + (6 * 24 * 60 * 60 * 1000));
        this.days[1].date = dt;
        this.days[2].date = new Date(dt.getTime() + (1 * 24 * 60 * 60 * 1000));
        this.days[3].date = new Date(dt.getTime() + (2 * 24 * 60 * 60 * 1000));
        this.days[4].date = new Date(dt.getTime() + (3 * 24 * 60 * 60 * 1000));
        this.days[5].date = new Date(dt.getTime() + (4 * 24 * 60 * 60 * 1000));
        this.days[6].date = new Date(dt.getTime() + (5 * 24 * 60 * 60 * 1000));
        break;
      case 'mie':
        this.days[0].date = new Date(dt.getTime() + (5 * 24 * 60 * 60 * 1000));
        this.days[1].date = new Date(dt.getTime() + (6 * 24 * 60 * 60 * 1000));
        this.days[2].date = dt;
        this.days[3].date = new Date(dt.getTime() + (1 * 24 * 60 * 60 * 1000));
        this.days[4].date = new Date(dt.getTime() + (2 * 24 * 60 * 60 * 1000));
        this.days[5].date = new Date(dt.getTime() + (3 * 24 * 60 * 60 * 1000));
        this.days[6].date = new Date(dt.getTime() + (4 * 24 * 60 * 60 * 1000));
        break;
      case 'jue':
        this.days[0].date = new Date(dt.getTime() + (4 * 24 * 60 * 60 * 1000));
        this.days[1].date = new Date(dt.getTime() + (5 * 24 * 60 * 60 * 1000));
        this.days[2].date = new Date(dt.getTime() + (6 * 24 * 60 * 60 * 1000));
        this.days[3].date = dt;
        this.days[4].date = new Date(dt.getTime() + (1 * 24 * 60 * 60 * 1000));
        this.days[5].date = new Date(dt.getTime() + (2 * 24 * 60 * 60 * 1000));
        this.days[6].date = new Date(dt.getTime() + (3 * 24 * 60 * 60 * 1000));
        break;
      case 'vie':
        this.days[0].date = new Date(dt.getTime() + (3 * 24 * 60 * 60 * 1000));
        this.days[1].date = new Date(dt.getTime() + (4 * 24 * 60 * 60 * 1000));
        this.days[2].date = new Date(dt.getTime() + (5 * 24 * 60 * 60 * 1000));
        this.days[3].date = new Date(dt.getTime() + (6 * 24 * 60 * 60 * 1000));
        this.days[4].date = dt;
        this.days[5].date = new Date(dt.getTime() + (1 * 24 * 60 * 60 * 1000));
        this.days[6].date = new Date(dt.getTime() + (2 * 24 * 60 * 60 * 1000));
        break;
      case 'sab':
        this.days[0].date = new Date(dt.getTime() + (2 * 24 * 60 * 60 * 1000));
        this.days[1].date = new Date(dt.getTime() + (3 * 24 * 60 * 60 * 1000));
        this.days[2].date = new Date(dt.getTime() + (4 * 24 * 60 * 60 * 1000));
        this.days[3].date = new Date(dt.getTime() + (5 * 24 * 60 * 60 * 1000));
        this.days[4].date = new Date(dt.getTime() + (6 * 24 * 60 * 60 * 1000));
        this.days[5].date = dt;
        this.days[6].date = new Date(dt.getTime() + (1 * 24 * 60 * 60 * 1000));
        break;
      case 'dom':
        this.days[0].date = new Date(dt.getTime() + (1 * 24 * 60 * 60 * 1000));
        this.days[1].date = new Date(dt.getTime() + (2 * 24 * 60 * 60 * 1000));
        this.days[2].date = new Date(dt.getTime() + (3 * 24 * 60 * 60 * 1000));
        this.days[3].date = new Date(dt.getTime() + (4 * 24 * 60 * 60 * 1000));
        this.days[4].date = new Date(dt.getTime() + (5 * 24 * 60 * 60 * 1000));
        this.days[5].date = new Date(dt.getTime() + (6 * 24 * 60 * 60 * 1000));
        this.days[6].date = dt;
        break;
      default:
        break;
    }
  }



  toggleVisibility(event, loteria): void {

    if (event) {
      this.lotteriesSelected.push(loteria);
    } else {
      const keyResponse = this.getKeyObject(loteria.idLoteria);
      if ( keyResponse  !== -1 ) {
        this.lotteriesSelected.splice( keyResponse , 1 );
      }
    }
  }



  /**
   * @author Luis Hernandez
   * @param id
   * @description metodo que se encarga
   * de buscar el punto dentro del array
   * de una loteria
   */
  getKeyObject(idLoteria) {
    return this.lotteriesSelected.map((e) => {
      return e.idLoteria;
    }).indexOf(idLoteria);
  }



  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
    this.shellState.title.clear();
  }

}
