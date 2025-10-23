const getColorBySign = (
    value,
    color1 = "text-[#f97066]",
    color2 = "text-[#32d583]"
) => {
    if (!value || typeof value !== "string") return "";

    if (value.startsWith("+")) return color1;
    if (value.startsWith("-")) return color2;

    return "";
};

export default getColorBySign;
