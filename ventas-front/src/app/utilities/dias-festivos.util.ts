/**
 * Clase utilitaria para los Días festivos no laborables en Colombia.
 * Calculados con base en la ley 51 de 1983
 */
export class DiasFestivosUtil {

  /** Es el dia en milisegundos */
  private static MILLISECONDS_DAY = 86400000;

  /** Constante con los dias ordinales */
  private static NEXT_DAY = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    NONE: 7
  };

  /** Dias festivos para las vacaciones semana de pascua */
  private static EASTER_WEEK_HOLIDAYS = [
    { day: -3, daysToSum: DiasFestivosUtil.NEXT_DAY.NONE, celebration: 'Jueves Santo' },
    { day: -2, daysToSum: DiasFestivosUtil.NEXT_DAY.NONE, celebration: 'Viernes Santo' },
    { day: 39, daysToSum: DiasFestivosUtil.NEXT_DAY.MONDAY, celebration: 'Ascensión del Señor' },
    { day: 60, daysToSum: DiasFestivosUtil.NEXT_DAY.MONDAY, celebration: 'Corphus Christi' },
    { day: 68, daysToSum: DiasFestivosUtil.NEXT_DAY.MONDAY, celebration: 'Sagrado Corazón de Jesús' }
  ];

  /** Dias festivos normales */
  private static HOLIDAYS = [
    { day: '01-01', daysToSum: DiasFestivosUtil.NEXT_DAY.NONE, celebration: 'Año Nuevo' },
    { day: '05-01', daysToSum: DiasFestivosUtil.NEXT_DAY.NONE, celebration: 'Día del Trabajo' },
    { day: '07-20', daysToSum: DiasFestivosUtil.NEXT_DAY.NONE, celebration: 'Día de la Independencia' },
    { day: '08-07', daysToSum: DiasFestivosUtil.NEXT_DAY.NONE, celebration: 'Batalla de Boyacá' },
    { day: '12-08', daysToSum: DiasFestivosUtil.NEXT_DAY.NONE, celebration: 'Día de la Inmaculada Concepción' },
    { day: '12-25', daysToSum: DiasFestivosUtil.NEXT_DAY.NONE, celebration: 'Día de Navidad' },
    { day: '01-06', daysToSum: DiasFestivosUtil.NEXT_DAY.MONDAY, celebration: 'Día de los Reyes Magos' },
    { day: '03-19', daysToSum: DiasFestivosUtil.NEXT_DAY.MONDAY, celebration: 'Día de San José' },
    { day: '06-29', daysToSum: DiasFestivosUtil.NEXT_DAY.MONDAY, celebration: 'San Pedro y San Pablo' },
    { day: '08-15', daysToSum: DiasFestivosUtil.NEXT_DAY.MONDAY, celebration: 'La Asunción de la Virgen' },
    { day: '10-12', daysToSum: DiasFestivosUtil.NEXT_DAY.MONDAY, celebration: 'Día de la Raza' },
    { day: '11-01', daysToSum: DiasFestivosUtil.NEXT_DAY.MONDAY, celebration: 'Todos los Santos' },
    { day: '11-11', daysToSum: DiasFestivosUtil.NEXT_DAY.MONDAY, celebration: 'Independencia de Cartagena' }
  ];

  /**
   * Metodo que permite obtener el lista de dias festivos de una anio espeficico
   * @param year, anio a calcular sus dias festivos
   */
  public static getColombiaHolidaysByYear(year) {

    // el anio es obligatorio
    if (!year) {
      return null;
    }

    // el anio debe ser numerico
    year = year.toString();
    if (!year.match(/^\d*$/g)) {
      return null;
    }

    // el anio debe ser entre 1970 y 99999
    if (year < 1970 || year > 99999) {
      return null;
    }

    // se configura los dias festivos normales
    const normalHolidays = DiasFestivosUtil.HOLIDAYS.map((element, index, array) => {
      return {
        holiday:
            DiasFestivosUtil.nextDay(year
            .toString()
            .concat('-')
            .concat(element.day),
          element.daysToSum
        ),
        celebrationDay:
          year
          .toString()
          .concat('-')
          .concat(element.day),
        celebration: element.celebration
      };
    });

    // domingos que caen festivos
    const sunday = new Date(DiasFestivosUtil.setHoliday(year));

    // festivos de pascua
    const easterWeekHolidays = DiasFestivosUtil.EASTER_WEEK_HOLIDAYS.map(
      (element, index, array) => {
        const day = new Date(sunday.getTime() + element.day * this.MILLISECONDS_DAY);
        return {
          holiday: DiasFestivosUtil.nextDay(
            DiasFestivosUtil.getFormattedDate(
              day.getUTCFullYear(),
              day.getUTCMonth() + 1,
              day.getUTCDate()
            ),
            element.daysToSum
          ),
          celebrationDay: DiasFestivosUtil.getFormattedDate(
            day.getUTCFullYear(),
            day.getUTCMonth() + 1,
            day.getUTCDate()
          ),
          celebration: element.celebration
        };
      }
    );

    // solo se retorna los dias festivos que aplica el anio
    return normalHolidays.concat(easterWeekHolidays).sort((a, b) => {
      let dateWeek: any;
      dateWeek = new Date(a.holiday);
      let datePascua: any;
      datePascua = new Date(b.holiday);
      return dateWeek - datePascua;
    });
  }

  /**
   * Metodo que permite obtener el nombre del dia a partir de su nro cordinal
   */
  public static getNameDay(day: number): string {
    let name =  null;
    switch (day) {
      case 0: {
        name = 'Domingo';
        break;
      }
      case 1: {
        name = 'Lunes';
        break;
      }
      case 2: {
        name = 'Martes';
        break;
      }
      case 3: {
        name = 'Miércoles';
        break;
      }
      case 4: {
        name = 'Jueves';
        break;
      }
      case 5: {
        name = 'Viernes';
        break;
      }
      case 6: {
        name = 'Sábado';
        break;
      }
   }
    return name;
  }

  /**
   * Metodo que permite configurar el dia festivo
   */
  private static setHoliday(yearp) {
    const year: any = parseInt(yearp);
    const A = year % 19;
    const B = Math.floor(year / 100);
    const C = year % 100;
    const D = Math.floor(B / 4);
    const E = B % 4;
    const F = Math.floor((B + 8) / 25);
    const G = Math.floor((B - F + 1) / 3);
    const H = (19 * A + B - D - G + 15) % 30;
    const I = Math.floor(C / 4);
    const K = C % 4;
    const L = (32 + 2 * E + 2 * I - H - K) % 7;
    const M = Math.floor((A + 11 * H + 22 * L) / 451);
    const N = H + L - 7 * M + 114;
    const month = Math.floor(N / 31);
    const day = 1 + (N % 31);
    return DiasFestivosUtil.getFormattedDate(year, month, day);
  }

  /**
   * Metodo que permite configrar el siguiente dia festivo
   */
  private static nextDay(day, sum) {
    const date = new Date(day);
    const newDate = sum === 7 ? date :
    new Date(date.getTime() + ((7 + sum - date.getUTCDay()) % 7) * DiasFestivosUtil.MILLISECONDS_DAY);
    return DiasFestivosUtil.getFormattedDate(
      newDate.getUTCFullYear(),
      newDate.getUTCMonth() + 1,
      newDate.getUTCDate()
    );
  }

  /**
   * Metodo que permite agregar los ceros especifico a los meses
   */
  private static addZero(nro: number) {
    const nroclone = nro.toString();
    if (nro > 0 && nro < 10 && !nroclone.startsWith('0')) {
      return '0'.concat(nroclone);
    }
    return nro;
  }

  /**
   * Se configura el formato especifico para el anio mes y dia
   */
  private static getFormattedDate(year, month, day) {
    return year
      .toString()
      .concat('-')
      .concat(DiasFestivosUtil.addZero(month))
      .concat('-')
      .concat(DiasFestivosUtil.addZero(day));
  }
}
