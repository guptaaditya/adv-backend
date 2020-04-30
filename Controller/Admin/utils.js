function getFirstDateOfCurrentMonth() {
    const date = new Date();
    const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDate;
}

module.exports = {
    getFirstDateOfCurrentMonth,
}