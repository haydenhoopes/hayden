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
});

document.querySelectorAll(".project-background, .project-background-single").forEach(thing => {
  let title = thing.childNodes[0].innerHTML;
  thing.style.backgroundColor = stringToColour(title);
});

// Modal
document.querySelector('#add-tech-btn').addEventListener('click', function() {
  document.querySelector('.modal').style.display = 'block';
});

document.querySelector('#post-tech-btn').addEventListener('click', function(e) {
  this.innerHTML = 'Posting technology...'
  let new_tech = document.querySelector('#new-tech').value;
  fetch("/technologies", {
    method: "POST",
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}, 
    body: JSON.stringify({"name": `${new_tech}`})
  }).then(res => {
    console.log(res);
    this.classList.remove('add');
    this.classList.add('edit');
    this.innerHTML = 'Technology added successfully';
  }).catch(res => {
    console.log(res);
    this.classList.remove('add');
    this.classList.add('remove');
    this.innerHTML = 'Technology couldn\'t be added';
  });
})


// document.querySelectorAll("div .card").forEach(card => {
//   card.addEventListener("click", function(e) {
//       let src = $(this).find("img")[0].src;
//       let re = new RegExp('(https).*');
//       let newSrc = re.exec(src)[0];
//       document.querySelector("#picture").src = newSrc;
//       document.querySelector("#picture-modal").style.display = "flex";

//   })
// });

// document.querySelector("#picture-exit").addEventListener("click", function() {
//   document.querySelector("#picture-modal").style.display = "none";
// });

// document.querySelector("#newFileButton").addEventListener("click", function() {
// var input = $("#files-1").clone();

// fileNo += 1;
// input.id = "files-" + fileNo;

// $("input[type=file]:last").after(input);
// });

document.querySelector("#file").addEventListener('change', async function(e) {
  let data = new FormData();
  let file = this['files'][0];
  data.append('file', file);
  
  try {
    await fetch("/uploadS3", {
        method: "POST",
        headers: {'Accept': 'multipart/form-data'}, 
        body: data
    });

    /*
        Maybe make a .js file that has functions for sending data? Like an api client module?
    */
    await fetch
  } catch (error) {
    console.error(error);
  }

  //   data.append(fileName, this['files'][0]);
  
  //   $.post({
  //       url: "/uploadS3",
  //       data: data,
  //       cache: false,
  //       contentType: false,
  //       processData: false,
  //       beforeSend: () => {
  //         let progressBar = document.createElement("progress");
  //         progressBar.setAttribute("id", "progressBar");
  //         this.parentNode.insertBefore(progressBar, this.nextSibling);
  //       },
  //       success: response => {
  //           console.log("Success response");
  //           console.log(response);
  //           let progressBar = $("#progressBar");
  //           let uploadMessage = $("#uploadMessage");
  //           if (response.status == "success") {
  //               uploadMessage.html("Upload successful");
  //               progressBar.val(100);


  //               addFileToProject($("#file").val().split(/(\\|\/)/g).pop());
  //           } else if (response.status == "error") {
  //               uploadMessage.html("There was an error uploading the file");
  //               progressBar.val(0);
  //           }
  //       },
  //       error: err => {
  //           console.log("error response");
  //         console.log(err);
  //       },
  //       complete: () => {
  //           window.setTimeout(() => {
  //             $("#file").val("");
  //             $("#progressBar").remove();
  //             $("#uploadMessage").html("");
  //           }, 3500);
  //       }
  //   });
});


function addFileToProject(fileName) {
$.get({
  url: "/api/g/coconuts/<%= coconut._id %>",
  success: (data) => {
      if (!data.files) { data.files = []}
      data.files.push(fileName);
      $.post({
          url: "/api/u/coconuts",
          data: data,
          success: (response) => {
              console.log(response.message);
          }
      })
  }
});
}