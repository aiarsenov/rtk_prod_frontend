const formatToUtcDateOnly = (date) => {
    if (!date) return;

    const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    return utcDate.toISOString().replace(".000Z", ".000000Z");
};

export default formatToUtcDateOnly;
