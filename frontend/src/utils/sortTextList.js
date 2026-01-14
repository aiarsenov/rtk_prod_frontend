/* Сортировка по алфавиту */

export const sortTextList = (list, sortBy) => {
    const parseText = (item) => {
        const raw = item?.[sortBy.key];
        if (!raw || typeof raw !== "string") return null;
        return raw.toLowerCase().trim();
    };

    switch (sortBy.action) {
        case "":
            return list;

        case "ascending": // A → Z
            return [...list].sort((a, b) => {
                const textA = parseText(a);
                const textB = parseText(b);

                if (!textA) return 1;
                if (!textB) return -1;

                return textA.localeCompare(textB);
            });

        case "descending": // Z → A
            return [...list].sort((a, b) => {
                const textA = parseText(a);
                const textB = parseText(b);

                if (!textA) return 1;
                if (!textB) return -1;

                return textB.localeCompare(textA);
            });

        default:
            return list;
    }
};
