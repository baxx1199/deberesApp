export default class RemainingDay {
  constructor(finalDate, currentDate) {
    this.finalDate = finalDate;
    this.currentDate = currentDate;
  }

  getRemainingTime() {
    const timeDifference = this.finalDate - this.currentDate;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    
    if (daysDifference < 0) {
      return "Vencida";
    } else if (daysDifference < 1) {
      return "Hoy";
    } else {
      const years = Math.floor(daysDifference / 365);
      const months = Math.floor((daysDifference % 365) / 30);
      const days = Math.floor(daysDifference % 30);
      
      // Ajuste de años bisiestos
      let currentYear = this.currentDate.getFullYear();
      let finalYear = this.finalDate.getFullYear();
      let leapYearCount = 0;

      for (let year = currentYear; year <= finalYear; year++) {
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          leapYearCount++;
        }
      }
      
      daysDifference -= leapYearCount; // Resta los días extra por años bisiestos
      
      let remainingTime = "";
      if (years > 0) {
        remainingTime += `${years} años `;
      }
      if (months > 0) {
        remainingTime += `${months} meses `;
      }
      if (days > 0) {
        remainingTime += `${days} días`;
      }
      return remainingTime;
    }
  }
}

/* 
    Notes for future baxx
    Add remaining time validation for: hours, minutes and seconds
    
*/
