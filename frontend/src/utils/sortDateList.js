export const sortDateList = (list, sortBy) => {
    const parseDate = (item) => {
        const raw = item?.[sortBy.key];

        if (!raw || typeof raw !== "string") return null;

        let date;

        // Пробуем распарсить как ISO формат (гггг-мм-дд)
        date = new Date(raw);
        if (!isNaN(date.getTime())) {
            return date;
        }

        // Пробуем распарсить как dd.mm.yyyy
        const dotParts = raw.split(".");
        if (dotParts.length === 3) {
            const [day, month, year] = dotParts.map(Number);
            date = new Date(year, month - 1, day);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }

        return null;
    };

    switch (sortBy.action) {
        case "":
            return list;

        case "descending":
            return [...list].sort((a, b) => {
                const dateA = parseDate(a);
                const dateB = parseDate(b);

                if (!dateA && !dateB) return 0;
                if (!dateA) return 1;
                if (!dateB) return -1;
                return dateA.getTime() - dateB.getTime();
            });

        case "ascending":
            return [...list].sort((a, b) => {
                const dateA = parseDate(a);
                const dateB = parseDate(b);

                if (!dateA && !dateB) return 0;
                if (!dateA) return 1;
                if (!dateB) return -1;
                return dateB.getTime() - dateA.getTime();
            });

        default:
            return list;
    }
};
