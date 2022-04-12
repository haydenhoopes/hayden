function addXElement() {
    // Adds an X button to inputs in divs with the input-with-button class
    document.querySelectorAll(".input-with-button").forEach(div => {
        let hasButton = false;
        for (node of div.childNodes) {
            if (node.tagName == "BUTTON") {
                hasButton = true;
                break;
            }
        }
        if (!hasButton) {
            let b = document.createElement("button");
            b.innerHTML = "X";
            b.type = "button";
            div.appendChild(b);
        }
    })
    removeItemXEventListener();
}


function removeItemXEventListener() {
    // Adds an event listener to each X button that removes its parent node and everything inside
    document.querySelectorAll(".input-with-button button").forEach(button => {
        button.addEventListener("click", function(e) {
            if (document.querySelectorAll(".input-with-button").length > 1) {
                this.parentElement.remove();
            }
        })
    })
}


function addNewLineItem() {
    // Adds a new div of input when there is content in the input.
    document.querySelectorAll(".input-with-button").forEach(div => {
        if (div.querySelector("input").value != "") {
            if (div.nextElementSibling != null) {

            } else {
                let newDiv = document.createElement("div");
                newDiv.classList += "input-with-button";
                newDiv.classList += " margin-sm";
                let newInput = document.createElement("input");
                newInput.classList += "X_removable";
                newInput.autocomplete = "off";
                newInput.type = "text";
                newInput.name = "l_Items";
                newDiv.append(newInput);
                div.parentElement.append(newDiv);
                addEventListenerToInput()
                addXElement();
            }

        }
    })
}

function addEventListenerToInput() {
    document.querySelectorAll(".input-with-button input").forEach(input => {
        input.addEventListener("input", addNewLineItem, {once: true});
    })
}

// Runs the function once at the start
addXElement()
addEventListenerToInput()