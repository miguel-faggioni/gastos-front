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
  let daysOfWeek = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ]
  return daysOfWeek[dayOfWeek]
}
