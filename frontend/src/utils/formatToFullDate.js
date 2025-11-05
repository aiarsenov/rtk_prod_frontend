const formatToFullDate = (date) => {
    if (!date) return;

    const newDate = new Date(date);

    let formattedDate = newDate.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    formattedDate = formattedDate.replace(" г.", "");

    const formattedTime = newDate.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return `${formattedDate}, ${formattedTime}`;
};

export default formatToFullDate;
