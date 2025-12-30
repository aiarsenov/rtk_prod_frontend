/**
 * Извлекает имя и фамилию (ФИ) из полного ФИО
 * @param {string} fullName - полное ФИО (может содержать имя, фамилию и отчество)
 * @returns {string} - имя и фамилия (первые два слова)
 */
const getFirstNameAndSurname = (fullName) => {
    if (!fullName || typeof fullName !== "string") {
        return "";
    }

    const parts = fullName.trim().split(/\s+/);

    // Если есть хотя бы два слова, возвращаем первые два
    if (parts.length >= 2) {
        return `${parts[0]} ${parts[1]}`;
    }

    // Если только одно слово, возвращаем его
    return parts[0] || "";
};

export default getFirstNameAndSurname;






