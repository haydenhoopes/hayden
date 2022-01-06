window.addEventListener("scroll", () => {
    threshold = 200;
    var scroll = window.pageYOffset;
    if ( scroll <= threshold) {
      var opacity = 1 - scroll / threshold;
      document.querySelector(".banner img").style.opacity = opacity;
      document.querySelector(".banner img").style.display = "block";
    } else {
      document.querySelector(".banner img").style.display = "none";
    }
  });