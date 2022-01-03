document.querySelectorAll("input[type=date]").forEach(date => {
    let today = new Date();
    let year = String(today.getFullYear());
    let month = String(today.getMonth() + 1);
    let day = String(today.getDate());
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    if (date.value == "") {
        date.value = `${year}-${month}-${day}`;
    }
})