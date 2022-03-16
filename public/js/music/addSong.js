// Bring up modal when add song button is clicked.


// Add even listener
document.querySelector("#add-song-btn").addEventListener("click", function() {
    // Add code here to erase everything inside modal before showing.

    document.querySelector(".modal").style.display = "block";
});

// X out button
document.querySelector("#song-modal-X").addEventListener("click", function() {
    document.querySelector(".modal").style.display = "none";
})