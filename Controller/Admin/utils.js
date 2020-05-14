function getFirstDateOfCurrentMonth() {
    const date = new Date();
    const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDate;
}

function getCurrentMonthName() {
    const today = new Date();
    return today.toLocaleString('default', { month: 'short' });
}

module.exports = {
    getFirstDateOfCurrentMonth,
    getCurrentMonthName,
}