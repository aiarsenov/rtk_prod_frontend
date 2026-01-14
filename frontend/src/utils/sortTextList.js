/* Сортировка по алфавиту */

export const sortTextList = (list, sortBy) => {
    const collator = new Intl.Collator(["ru", "en"], {
        sensitivity: "base",
        ignorePunctuation: true,
    });

    const parseText = (item) => {
        const value = item?.[sortBy.key];
        if (typeof value !== "string") return "";
        return value.trim();
    };

    const isCyrillic = (text) => /^[\u0400-\u04FF]/.test(text);

    if (!sortBy.action) return list;

    return [...list].sort((a, b) => {
        const textA = parseText(a);
        const textB = parseText(b);

        const aIsCyr = isCyrillic(textA);
        const bIsCyr = isCyrillic(textB);

        // Кириллица всегда выше
        if (aIsCyr !== bIsCyr) {
            return aIsCyr ? -1 : 1;
        }

        // Обычное алфавитное сравнение
        const result = collator.compare(textA, textB);

        return sortBy.action === "ascending" ? result : -result;
    });
};
