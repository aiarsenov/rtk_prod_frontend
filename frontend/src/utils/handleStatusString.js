const handleStatusString = (status) => {
    if (!status) return;

    if (
        status.toLowerCase() === "утверждён" ||
        status.toLowerCase() === "утвержден" ||
        status.toLowerCase() === "получено согласие"
    ) {
        return "status_active";
    } else if (
        status.toLowerCase() === "в процессе" ||
        status.toLowerCase() === "в работе"
    ) {
        return "status_inprogress";
    } else if (
        status.toLowerCase() === "получен отказ" ||
        status.toLowerCase() === "отменен" ||
        status.toLowerCase() === "отменён"
    ) {
        return "status_canceled";
    }
};

export default handleStatusString;
