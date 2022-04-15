document.querySelectorAll(".box").forEach(input => {
    input.addEventListener("mouseenter", function(e) {
        e.target.parentElement.childNodes.forEach(node => {
            if (node.tagName == "P") {
                node.classList.add("label-active");
            }
        }) 
    });
    input.addEventListener("mouseleave", function(e) {
        e.target.parentElement.childNodes.forEach(node => {
            if (node.tagName == "P") {
                node.classList.remove("label-active");
            }
        }) 
    });
})

document.querySelectorAll(".box-secondary").forEach(input => {
    input.addEventListener("mouseenter", function(e) {
        e.target.parentElement.childNodes.forEach(node => {
            if (node.tagName == "P") {
                node.classList.add("label-active");
            }
        }) 
    });
    input.addEventListener("mouseleave", function(e) {
        e.target.parentElement.childNodes.forEach(node => {
            if (node.tagName == "P") {
                node.classList.remove("label-active");
            }
        }) 
    });
})