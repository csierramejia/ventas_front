import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductosService } from '../../productos.service';
import { LoteriasDTO } from 'src/app/dtos/escrutinio/loterias/loterias.dto';

@Component({
  selector: 'app-apuesta',
  templateUrl: './apuesta.component.html',
  styleUrls: ['./apuesta.component.css'],
  providers: [ProductosService]
})
export class ApuestaComponent implements OnInit {

  @Output() chanceNumero: EventEmitter<any> = new EventEmitter();

  pathLotteries = '../../../../../assets/img/loterias/';

  loterias: LoteriasDTO[];

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
  enabledCombined = false;
  enabledThree = false;
  enabledTwo = false;
  enabledOne = false;


  chanceForm = new FormGroup({
    fecha: new FormControl(''),
    numero: new FormControl(''),
    tipoChanceDirecto: new FormControl({value: '', disabled: true}),
    tipoChanceCombinado: new FormControl({value: '', disabled: true}),
    tresCifras: new FormControl({value: '', disabled: true}),
    dosCifras: new FormControl({value: '', disabled: true}),
    unaCifras: new FormControl({value: '', disabled: true}),
    valorNumero: new FormControl(''),
    valorNumeroTres: new FormControl({value: '', disabled: true}),
    valorNumeroDos: new FormControl({value: '', disabled: true}),
    valorNumeroUna: new FormControl({value: '', disabled: true})
  });

  constructor(
    private productosService: ProductosService
  ) {
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
      this.productosService.consultarLoterias().subscribe(
        loteriasData => {
          this.loterias = loteriasData;
          this.viewLotteries = true;
        },
        error => {
          // this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
  }

  /**
   * @author Luis Hernandez
   * @description Validamos de cuantas cifras es el
   * numero para saber que tipo de chance se va a realizar
   */
  // validNumber(): void {
  //   if (String(this.chanceForm.get('numero').value).length === 4) {
  //     this.chanceForm.controls.tipoChanceDirecto.enable();
  //     this.chanceForm.controls.tipoChanceCombinado.enable();
  //   } else if (String(this.chanceForm.get('numero').value).length === 3) {
  //     this.chanceForm.controls.tipoChanceDirecto.disable();
  //     this.chanceForm.controls.tipoChanceCombinado.disable();

  //     this.enabledThree = false;
  //     this.enabledTwo = true;
  //     this.enabledOne = true;


  //   }
  // }


  /**
   * @author Luis Hernandez
   * @description si el usuario selecciona modalidad
   * directo habilitamos los cambos de tres, dos y una cifra
   */
  // enabledInputsMore(isChecked: boolean): void {
  //   if (this.chanceForm.controls.tipoChanceDirecto.status === 'VALID' && isChecked) {
  //     this.enabledThree = true;
  //     this.enabledTwo = true;
  //     this.enabledOne = true;
  //   } else {
  //     this.enabledThree = false;
  //     this.enabledTwo = false;
  //     this.enabledOne = false;
  //   }
  // }


  // enabledTresCifras(isChecked: boolean): void {
  //   if (isChecked) {


  //     console.log(String(this.chanceForm.controls.numero.value).substr(-3));

  //     this.chanceForm.controls.tresCifras.enable();
  //     this.chanceForm.controls.valorNumeroTres.enable();
  //   } else {
  //     this.chanceForm.controls.tresCifras.disable();
  //     this.chanceForm.controls.valorNumeroTres.disable();
  //   }
  // }

  /**
   * @author Luis Hernandez
   * @description Metodo que se encargar de realizar
   * la preparación inicial del componente
   */
  /*configInit(): void {
    this.configCalendar();
  }*/


  /**
   * @author Luis Hernandez
   * @description Metodo que se encargar de inicializar
   * la configuración del calendario
   */
  /*configCalendar(): void {
    this.es = {
      firstDayOfWeek: 0,
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
      monthNamesShort: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
      today: 'Hoy',
      clear: 'Limpiar',
      dateFormat: 'mm/dd/yy',
      weekHeader: 'Wk'
    };
  }*/

  /**
   * @author Luis Hernandez
   * @description Metodo que devuelve un numero aleatorio de 3 cifras
   */
  /*getNumberThree(): void {
    console.log(Math.round(Math.random() * (100 - 999) + 999 ));
  }*/


  /**
   * @author Luis Hernandez
   * @description Metodo que devuelve un numero aleatorio de 4 cifras
   */
  /*getNumberFour(): void {
    console.log(Math.round(Math.random() * (1000 - 9999) + 9999 ));
  }*/



  /*chanceNumero(e): void {
    console.log('llego el numero');
    console.log(e);
    console.log('llego el numero');
  }*/


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

}
