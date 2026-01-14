/* Сортировка по дате */

export const sortDateList = (list, sortBy) => {
    const parseDate = (item) => {
        const raw = item?.[sortBy.key];

        if (!raw || typeof raw !== "string") return null;

        // Пробуем распарсить как dd.mm.yyyy
        const dotParts = raw.split(".");
        if (dotParts.length === 3) {
            const [day, month, year] = dotParts.map(Number);
            const date = new Date(year, month - 1, day);
            if (!isNaN(date.getTime())) return date;
        }

        // Пробуем распарсить как ISO, убираем лишние нули в микросекундах
        try {
            const iso = raw.replace(/\.(\d{1,6})Z$/, "Z"); // убираем лишние микросекунды
            const date = new Date(iso);
            if (!isNaN(date.getTime())) return date;
        } catch {
            return null;
        }

        return null;
    };

    return [...list].sort((a, b) => {
        const dateA = parseDate(a);
        const dateB = parseDate(b);

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        if (sortBy.action === "descending") {
            return dateA.getTime() - dateB.getTime(); // меньше даты вперед
        } else if (sortBy.action === "ascending") {
            return dateB.getTime() - dateA.getTime(); // больше даты вперед
        }

        return 0;
    });
};
