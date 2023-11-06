export default class RemainingDay {
  final_Date;
  current_year;
  current_month;
  current_day;

  remaining_year;
  remaining_months;
  remaining_days;

  constructor(_final_Date, current_date) {
    this.current_day = current_date.getDate();
    this.current_month = current_date.getMonth() + 1;
    this.current_year = current_date.getFullYear();
    this.final_Date = this.get_only_final_date(_final_Date);
  }

  get_full_remaining() {
    this.remaining_year = this.final_Date[0] - this.current_year;
    this.get_months_remaining();
  }

  get_months_remaining() {
    let difference_of_months = this.final_Date[1] - this.current_month;

    let months = 0,
      aux = 0,
      days = Number(31 - this.current_day) + Number(this.final_Date[2]);

    if (difference_of_months > 0) {
      aux = 31 * difference_of_months - (31 - days);
      months = Math.floor(aux / 31);
      days = aux - months * 31;
    }
    if (difference_of_months < 0) {
      // cuantos meses han pasado, si 1
      // aux = 30 - diaInicial + diaFinal == dias del mes en que la tarea estuvo activa
      //si es 2 o mas
      // month = 30* (-)diferencia de mes - aux
    }
    if (difference_of_months == 0) {
      aux = Number(this.final_Date[2]);
      days = aux - this.current_day;
    }
    this.remaining_days = days;
    this.remaining_months = months;
    this.pruebaDiff();
  }

  /*
   *
   * method which convert a full dateTime in a single date
   *
   * params - DATETIME-LOCAL type with format yyyy-MM-ddThh:mm provider of HTML inputs
   *
   *
   *  */

  get_only_final_date(fullDate) {
    let final_date_cut = fullDate.split("T");
    let get_date = final_date_cut[0].split("-");

    return get_date;
  }

  /* Prueba opcional */
  pruebaDiff() {
    let date1 =
      this.final_Date[0] + "-" + this.final_Date[1] + "-" + this.final_Date[2];
    let datep = new Date();
    let date2 =
      datep.getFullYear() +
      "-" +
      Number(datep.getMonth() + 1) +
      "-" +
      datep.getDate();
    let aux1 = new Date(date1);
    let aux2 = new Date(date2);

    
    let dif = Math.round((aux1 - aux2) / (1000 * 60 * 60 * 24));
    let mesesPruebaRestante;
    let diaPruebaRestante;
    let añosPruebaRestante;

    if (dif > 30) {
      mesesPruebaRestante = dif / 30;
      diaPruebaRestante = Math.round(30 * mesesPruebaRestante);
    }
    /*  if (mesesPruebaRestante > 12) {
      añosPruebaRestante = Math.round(mesesPruebaRestante / 12);
      mesesPruebaRestante -= añosPruebaRestante * 12;
    } */
   
    
  }

  //this method formats the time remaining to simple text
  remaining_ToString() {
    this.get_full_remaining();
    let remaining_string = "";

    if (this.remaining_year != 0 && this.remaining_months != 0) {
      remaining_string = `${this.remaining_year} años`;
     
    }
    if (this.remaining_months != 0) {
      remaining_string += ` ${this.remaining_months} meses`;
      
    }
    if (this.remaining_days > 0) {
      remaining_string += ` ${this.remaining_days} dias`;
     
    } else if (
      this.remaining_days == 0 &&
      this.remaining_year <= 0 &&
      this.remaining_months <= 0
    ) {
      remaining_string = "Hoy";
      
    }
    if (this.remaining_days < 0) {
      remaining_string = "Vencida";
      
    }

    return remaining_string;
  }
}

/* 
    Notes for future baxx
    Add remaining time validation for: hours, minutes and seconds
    
*/
