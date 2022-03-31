// Bring up modal when add song button is clicked.


// Add event listener
document.querySelector("#add-song-btn").addEventListener("click", function() {
    // TODO: Add code here to erase everything inside modal before showing.

    document.querySelector(".modal").style.display = "block";
});

// X out button
document.querySelector("#song-modal-X").addEventListener("click", function() {
    document.querySelector(".modal").style.display = "none";
});


// Check Youtube AJAX event
document.querySelector("#check-youtube-btn").addEventListener("click", function() {
    loadingYoutubeButton();
    let link = document.querySelector("#youtube-link").value;
    
    fetch("/music/checkYoutube", {
      method: "POST",
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}, 
      body: JSON.stringify({"link": `${link}`})
    }).then(data => {
      return data.json();
    }).then(data => {
        console.log(data);
        finishedLoadingYoutubeButton(data);
        
    });
  });

// Change color and text of button on click to show loading
function loadingYoutubeButton() {
    let btn = document.querySelector("#check-youtube-btn");
    btn.classList.remove("add");
    btn.classList.add("warning");
    btn.innerHTML = "Checking YouTube...";
}

// Change color back to normal
function finishedLoadingYoutubeButton(data) {
    let btn = document.querySelector("#check-youtube-btn");
    btn.classList.remove("warning");
    btn.classList.add("add");

    let downloadBtn = document.querySelector("#download-youtube-btn");
    btn.style.display = 'none';
    downloadBtn.style.display = 'block';

    downloadBtn.innerHTML = `Download: ${data.videoTitle}`;
    let videoTitle = data.videoTitle.replaceAll("+", "and");
    videoTitle = videoTitle.replaceAll(" ", "+");
    downloadBtn.href = `https://hayden-music-bucket.s3.amazonaws.com/${videoTitle}.mp3`;

    btn.innerHTML = "Finished checking. Click to check again.";
}

// When download button clicked, remove download button.
document.querySelector("#download-youtube-btn").addEventListener("click", function() {
  let btn = document.querySelector("#check-youtube-btn");
  let downloadBtn = document.querySelector("#download-youtube-btn");

  btn.style.display = 'block';
  downloadBtn.style.display = 'none';


})