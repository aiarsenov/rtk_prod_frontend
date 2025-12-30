/**
 * Форматирует число с запятой в качестве разделителя десятичных знаков
 * @param {number|string} value - число для форматирования
 * @param {number} decimals - количество знаков после запятой
 * @returns {string} - отформатированное число с запятой
 */
const formatNumberWithComma = (value, decimals = 2) => {
    if (value === null || value === undefined || value === "") {
        return "0";
    }

    const numValue = typeof value === "string"
        ? parseFloat(value.replace(",", "."))
        : value;

    if (isNaN(numValue)) {
        return "0";
    }

    return numValue.toFixed(decimals).replace(".", ",");
};

export default formatNumberWithComma;






