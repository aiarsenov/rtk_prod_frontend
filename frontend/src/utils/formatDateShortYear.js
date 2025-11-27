/**
 * Форматирует дату в формат dd.mm.yy (сокращенный год)
 * Принимает строку в формате "dd.mm.yyyy" или "dd.mm.yyyy - dd.mm.yyyy"
 * @param {string} dateStr - строка с датой
 * @returns {string} - отформатированная дата
 */
const formatDateShortYear = (dateStr) => {
  if (!dateStr) return "";

  // Проверяем, заканчивается ли строка на " -" или " - "
  const trimmedStr = dateStr.trim();
  if (trimmedStr.endsWith(" -") || trimmedStr.endsWith(" - ")) {
    const startDate = trimmedStr.replace(/ -.*$/, "").trim();
    const formattedStart = formatSingleDate(startDate);
    if (formattedStart) {
      return `${formattedStart} -`;
    }
    return dateStr;
  }

  // Если это диапазон дат (содержит " - " в середине)
  if (dateStr.includes(" - ")) {
    const [startDate, endDate] = dateStr.split(" - ");
    const formattedStart = formatSingleDate(startDate.trim());
    const formattedEnd = endDate && endDate.trim() ? formatSingleDate(endDate.trim()) : "";
    if (formattedStart) {
      return formattedEnd
        ? `${formattedStart} - ${formattedEnd}`
        : `${formattedStart} -`;
    }
    return dateStr;
  }

  // Одна дата
  return formatSingleDate(dateStr) || dateStr;
};

/**
 * Форматирует одну дату в формат dd.mm.yy
 * @param {string} dateStr - строка с датой в формате "dd.mm.yyyy"
 * @returns {string} - отформатированная дата в формате "dd.mm.yy"
 */
const formatSingleDate = (dateStr) => {
  if (!dateStr) return "";

  const dateMatch = dateStr.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dateMatch) {
    const [, day, month, year] = dateMatch;
    const shortYear = year.slice(-2); // Берем последние 2 цифры года
    return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${shortYear}`;
  }

  if (dateStr.match(/^\d{1,2}\.\d{1,2}\.\d{2}$/)) {
    return dateStr;
  }

  return dateStr;
};

export default formatDateShortYear;
