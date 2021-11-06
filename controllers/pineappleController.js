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
   api.scan("technologies").then(techs => {
     res.locals.technologies = techs.data;
     res.render(`${endpoint}/create`);
   }).catch(err => {
     res.flash("error", err);
     res.render(`${endpoint}/create`);
   })
 },

 postCreate: (req, res, next) => {
   let data = JSON.stringify(req.body);

   api.create(endpoint, data).then(response => {
     req.flash("success", response.data.message);
     console.log(response.data.message);
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
 }
}