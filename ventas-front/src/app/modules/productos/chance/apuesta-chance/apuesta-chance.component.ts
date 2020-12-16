import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductosService } from '../../productos.service';
import { ClientesDTO } from 'src/app/dtos/productos/chance/clientes.dto';
import { MessageService } from 'primeng/api';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { CrearClienteComponent } from '../crear-cliente/crear-cliente.component';
import { CurrencyPipe } from '@angular/common';
import { FechaUtil } from 'src/app/utilities/fecha-util';

@Component({
  selector: 'app-apuesta-chance',
  templateUrl: './apuesta-chance.component.html',
  styleUrls: ['./apuesta-chance.component.css'],
  providers: [ProductosService]
})
export class ApuestaChanceComponent extends CommonComponent implements OnInit  {

  dayBet: Date;
  fechaActual: Date;
  loterias = [];
  rutaServidor: string;
  checked: boolean;
  days = [
    { text: 'L', name: 'lun', date: null },
    { text: 'M', name: 'mar', date: null },
    { text: 'M', name: 'mie', date: null },
    { text: 'J', name: 'jue', date: null },
    { text: 'V', name: 'vie', date: null },
    { text: 'S', name: 'sab', date: null },
    { text: 'D', name: 'dom', date: null }
  ];

  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService
  ) {
    super();
    // obtenemos el semanario
    this.setDaysServicio();
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
    const fechaA = this.fechaActual;
    const fechaB = FechaUtil.stringToDate(this.dayBet.toString());
    if (fechaB < fechaA) {
      fechaB.setDate(fechaB.getDate() + 7);
      this.dayBet = fechaB;
    } else {
     this.dayBet = FechaUtil.stringToDate(this.dayBet.toString());
    }
    // colocamos color al dia seleccionamos y le quitamos a los demas
    this.days.forEach(element => {
      if (element.name === day.name) {
        const chip = document.getElementById(day.name);
        chip.style.backgroundColor = '#BE1E42';
        chip.style.color = '#fff';
      } else {
        const chip = document.getElementById(element.name);
        chip.style.backgroundColor = '#FFFFFF';
        chip.style.color = '#BE1E42';
      }
    });
    // llamamos el metodo que se encarga de consultar las loterias
    this.getLotteries();
  }



  /**
   * @description Metodo que se encarga de traer los dias del semanario
   */
  setDaysServicio(): void {
    this.productosService.consultarSemanaServidor().subscribe(
      dias => {
        const rs: any = dias;
        this.fechaActual = FechaUtil.stringToDate(rs[7].toString());
        let contador = 0;
        rs.forEach(element => {
          if (contador >= 7) { return; }
          contador++;
          const date = FechaUtil.stringToDate(element.toString());
          if (date.getDay() === 1) {
            this.days[0].date = element;
          } else if (date.getDay() === 2) {
            this.days[1].date = element;
          } else if (date.getDay() === 3) {
            this.days[2].date = element;
          } else if (date.getDay() === 4) {
            this.days[3].date = element;
          } else if (date.getDay() === 5) {
            this.days[4].date = element;
          } else if (date.getDay() === 6) {
            this.days[5].date = element;
          } else if (date.getDay() === 0) {
            this.days[6].date = element;
          }
        });
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }




  /**
   * @author Luis Hernandez
   * @description funcion que llama al servicio
   * de loterias y trae las loterias disponibles
   * según el día
   */
  getLotteries(): void {
    this.loterias = [];
    this.productosService.consultarLoterias(this.dayBet, 2).subscribe(
      loteriasData => {
        const rs: any = loteriasData;
        rs.forEach(element => {
          this.loterias.push({
            idLoteria: element.idLoteria,
            codigo: element.codigo,
            nombre: element.nombre,
            nombreCorto: element.nombreCorto,
            telefono: element.telefono,
            idEstado: element.idEstado,
            idEmpresa: element.idEmpresa,
            idSorteo: element.idSorteo,
            idSorteoDetalle: element.idSorteoDetalle,
            checked: false,
            url: this.rutaServidor + element.nombreImagen,
            horaSorteo: element.horaSorteo
          });
        });
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }


}
