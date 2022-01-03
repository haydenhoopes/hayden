const api = require("../api/api");
let aws = require("aws-sdk");
aws.config.update({region: 'us-east-1'});
const endpoint = "pineapples";

let months = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
}

// ****  PROJECT SCHEMA  ****
// _id
// Title
// Date
// Text
// Files
// Location

module.exports = {
 all: (req, res, next) => {
    api.pscan(endpoint).then(data => {
      res.locals.pineapples = data.data.Items;
      res.render(`${endpoint}/all`);
    }).catch(err => {
      req.flash("error", err.message);
      res.send(err);
    });
 },

 getsingle: async (req, res, next) => {
  let data = await api.get(endpoint, req.params.id);
  res.locals.pineapple = data.data[0];

  // Date formatting, nothing special
  let date=new Date(data.data[0].p_Date);
  res.locals.pineapple.Date = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

  // Image format, nothing special
  res.locals.i = req.query.i;

  res.locals.pineapple.files;
  res.render(`${endpoint}/single`);
 },
 
 getCreate: (req, res, next) => {
  res.render(`${endpoint}/create`);
 },

 postCreate: (req, res, next) => {
  if (req.body.encoded == "on") {
    req.body.p_Text = encode(req.body.p_Text);
 }
   let data = JSON.stringify(req.body);
   api.create(endpoint, data).then(response => {
     req.flash("success", response.data.message);
     res.redirect(`/${endpoint}`);
   }).catch(err => {
     req.flash("error", "Not enough water for the pineapple: " + err);
     res.redirect(`/${endpoint}`);
   })
},

 getUpdate: async (req, res, next) => {
   try {
      let id = req.params.id;
      let data = await api.get(endpoint, id);
      res.locals.pineapple = data.data[0];
      res.render(`${endpoint}/update`);
   } catch (error) {
      req.flash("error", error.message);
      res.redirect(`/${endpoint}/${id}`);
   }
 },

 postUpdate: (req, res, next) => {
  let id = req.body._id;

  api.update(endpoint, JSON.stringify(req.body)).then(() => { 
    req.flash("success", "Pineapple taken care of successfully!");
    res.redirect(`/${endpoint}/${id}`);
  }).catch(err => {
    req.flash("error", err.message);
    res.redirect(`/${endpoint}`);
  })
},

 delete: (req, res, next) => {
  let id = req.params.id;
  api.delete(endpoint, {_id: id}).then(() => {
    req.flash("success", "Deletion successful!");
    res.redirect(`/${endpoint}`);
  }).catch(err => {
    req.flash("error", err);
    res.redirect(`/${endpoint}`);
  })
 },

 translator: (req, res, next) => {
  res.render(`${endpoint}/translator`);
 },

 decode: (req, res, next) => {
   if (req.body.lang == "Long Patrol" && req.body.passphrase.toLowerCase() == "chickens rule!") {
    res.locals.returnText = decode(req.body.encoded);
    res.render(`${endpoint}/translator`);
   } else {
     res.locals.returnText = "Could not decode from that language\n" + req.body.encoded;
    res.render(`${endpoint}/translator`);
   }
 }
}

// Functions

// aw is a space " "
// di is a period "."
// rt is a comma ","
function encode(text) {
  let newString = "";

  for (letter of text) {
    let value = letter.charCodeAt(0) - 65;
    if (letter != " " && letter != "." && letter != "," && letter != "'") {
      let newValue;
      if (value % 2 == 1) {
        newValue = value - 1;
      } else {
        newValue = value + 1;
      }
      newString += String.fromCharCode(65 + newValue);
    } else {
      switch (letter) {
        case " ":
          newString += "aw";
          break;
        case ",":
          newString += "rt";
          break;
        case ".":
          newString += "di";
          break;
        case "'":
          newString += "ih";
          break;
      }
    }
  }

  return newString
}

function decode(text) {
  let newString = "";

  text = text.split("aw").join(" ");
  text = text.split("rt").join(",");
  text = text.split("di").join(".");
  text = text.split("ih").join("'");

  for (letter of text) {
    if (letter != " " && letter != "." && letter != "," && letter != "'") {
      let value = letter.charCodeAt(0) - 65;
      let newValue;
      if (value % 2 == 1) {
        newValue = value - 1;
      } else {
        newValue = value + 1;
      }
        newString += String.fromCharCode(65 + newValue);
      } else {
        newString += letter;
      }
    }
    return newString;
}