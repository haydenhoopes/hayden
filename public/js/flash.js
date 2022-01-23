function clearFlashes() {
    document.querySelectorAll(".flashes").forEach(flash => {
        console.log(flash);
        flash.remove();
    })
}

// Removes the flash messages after 10 seconds
setTimeout(clearFlashes, 10000);
