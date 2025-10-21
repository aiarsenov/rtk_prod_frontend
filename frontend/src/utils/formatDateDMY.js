const formatDateDMY = (date, type = "days") => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return type == "days" ? `${year}-${month}-${day}` : `${year}-${month}`;
};

export default formatDateDMY;
