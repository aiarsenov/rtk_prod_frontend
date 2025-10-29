const handleStatusString = (status) => {
    if (!status) return;

    if (
        status.toLowerCase() === "утверждён" ||
        status.toLowerCase() === "утвержден" ||
        status.toLowerCase() === "получено согласие"
    ) {
        return "completed";
    } else if (
        status.toLowerCase() === "получен отказ" ||
        status.toLowerCase() === "отменен" ||
        status.toLowerCase() === "отменён"
    ) {
        return "canceled";
    }
};

export default handleStatusString;
