document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focusin", function(e) {
        e.target.parentElement.childNodes.forEach(node => {
            if (node.tagName == "LABEL") {
                node.classList.add("label-active");
            }
        }) 
    });
    input.addEventListener("focusout", function(e) {
        e.target.parentElement.childNodes.forEach(node => {
            if (node.tagName == "LABEL") {
                node.classList.remove("label-active");
            }
        }) 
    });
})

document.querySelectorAll("textarea").forEach(input => {
    input.addEventListener("focusin", function(e) {
        e.target.parentElement.childNodes.forEach(node => {
            if (node.tagName == "LABEL") {
                node.classList.add("label-active");
            }
        }) 
    });
    input.addEventListener("focusout", function(e) {
        e.target.parentElement.childNodes.forEach(node => {
            if (node.tagName == "LABEL") {
                node.classList.remove("label-active");
            }
        }) 
    });
})