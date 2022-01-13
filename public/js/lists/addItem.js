document.getElementById("disabled-item").addEventListener("input", addItem, { once: true });

function addItem() {
    let form = document.querySelector("form");
    let lastItem = form.lastElementChild;
    let lastText = lastItem.previousElementSibling;
    var span = document.createElement("span");
    span.innerHTML = ' X';
    lastText.appendChild(span);

    document.querySelectorAll("form span").forEach(x => {
        x.addEventListener("click", removeItem);
    })

    let copy = lastText.cloneNode();
    console.log(copy);
    document.getElementById("disabled-item").id = "";
    copy.id = "disabled-item";
    copy.value = "";
    copy.addEventListener("input", addItem, { once: true});
    form.insertBefore(copy, lastItem);
    form.insertBefore(span, lastItem);
}

function removeItem(e) {
    e.previousElementSibling.remove();
    e.remove();
}