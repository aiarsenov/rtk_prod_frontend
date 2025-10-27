const getColorBySign = (
    value,
    colorPositive = "text-[#f97066]",
    colorNegative = "text-[#32d583]"
) => {
    if (value === null || value === undefined) return "";

    const num = Number(value);

    if (!isNaN(num)) {
        if (num > 0) return colorPositive;
        if (num < 0) return colorNegative;
        return "";
    }

    if (typeof value === "string") {
        if (value.startsWith("+")) return colorPositive;
        if (value.startsWith("-")) return colorNegative;
    }

    return "";
};

export default getColorBySign;
