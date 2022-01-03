var stringToColour = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xCF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

document.querySelectorAll(".colored-thing").forEach(t => {
  t.style.backgroundColor = stringToColour(t.getAttribute("data-color"));
})