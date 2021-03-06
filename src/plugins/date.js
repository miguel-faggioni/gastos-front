Date.prototype.getMonthAbbreviation = function() {
  let monthAbbreviations = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]
  return monthAbbreviations[this.getMonth()]
}

Date.prototype.getDayOfWeekAbbreviation = function(dayOfWeek) {
  let daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  return daysOfWeek[dayOfWeek]
}

/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
// taken from https://stackoverflow.com/questions/9045868/javascript-date-getweek
Date.prototype.getWeekOfYear = function() {
  /*getWeekOfYear() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

  dowOffset = 0 // default dowOffset to zero
  const newYear = new Date(this.getFullYear(), 0, 1)
  let day = newYear.getDay() - dowOffset // the day of week the year begins on
  day = day >= 0 ? day : day + 7
  const daynum =
    Math.floor(
      (this.getTime() -
        newYear.getTime() -
        (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
        86400000
    ) + 1
  let weeknum
  // if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1
    if (weeknum > 52) {
      const nYear = new Date(this.getFullYear() + 1, 0, 1)
      let nday = nYear.getDay() - dowOffset
      nday = nday >= 0 ? nday : nday + 7
      /*if the next year starts before the middle of
                the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7)
  }
  return weeknum
}
