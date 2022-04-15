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

document.querySelectorAll(".technology").forEach(t => {
    var text = t.innerHTML;
    t.style.backgroundColor = stringToColour(text);
})

document.querySelectorAll(".technology-sm").forEach(t => {
  var text = t.innerHTML;
  t.style.backgroundColor = stringToColour(text);
})

document.querySelectorAll(".ul-list a").forEach(t => {
  var text = t.querySelector("div:last-child").innerHTML;
  t.querySelector("div:first-child").style.backgroundColor = stringToColour(text);
})

document.querySelectorAll(".project-background, .project-background-single").forEach(thing => {
  let title = thing.childNodes[0].innerHTML;
  thing.style.backgroundColor = stringToColour(title);
})