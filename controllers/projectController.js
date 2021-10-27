const api = require("../api/api");
const s3 = require("../api/s3");
const fs = require("fs");
let aws = require("aws-sdk");
aws.config.update({region: 'us-east-1'});
let S3 = new aws.S3();
const endpoint = "coconuts";

let urlPrefix = process.env.url_prefix;

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
// title
// headline
// shortDescription
// languages
// topics
// images
// videoLink
// situation
// task
// action
// result
// liveLink
// time
// startDate
// finishDate
// type: job, workProject, personalProject
// category: programming, data, research
// display: true or false
// Location
// role

module.exports = {
 all: (req, res, next) => {
    api.scan(endpoint).then(data => {
      res.locals.coconuts = data.data;
      res.render(`${endpoint}/all`);
    }).catch(err => {
      req.flash("error", err.message);
      res.send(err);
    });
 },

 getsingle: async (req, res, next) => {
  let data = await api.get(endpoint, req.params.id);
  res.locals.coconut = data.data[0];

  // Date formatting, nothing special
  let startDate=new Date(data.data[0].startDate), endDate=new Date(data.data[0].endDate);
  res.locals.coconut.startDateString = `${months[startDate.getMonth()]} ${startDate.getDate()}, ${startDate.getFullYear()}`;
  res.locals.coconut.endDateString = `${months[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;

  // Image format, nothing special
  res.locals.i = req.query.i;

  res.locals.coconut.files;
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
     res.redirect(`${urlPrefix}/${endpoint}`);
   }).catch(err => {
     req.flash("error", "Not enough water for the coconut: " + err);
     res.redirect(`${urlPrefix}/${endpoint}`);
   })
},

 getUpdate: async (req, res, next) => {
   try {
      let techs = await api.scan("technologies");
      res.locals.technologies = techs.data;
      let id = req.params.id;
      let data = await api.get(endpoint, id);
      res.locals.coconut = data.data[0];
      res.render(`${endpoint}/update`);
   } catch (error) {
      req.flash("error", error.message);
      res.redirect(`${urlPrefix}/${endpoint}/${id}`);
   }
 },

 postUpdate: (req, res, next) => {
  let id = req.body._id;
  api.update(endpoint, JSON.stringify(req.body)).then(() => { 
    req.flash("success", "Coconut taken care of successfully!");
    res.redirect(`${urlPrefix}/${endpoint}/${id}`);
  }).catch(err => {
    req.flash("error", err.message);
    res.redirect(`${urlPrefix}/${endpoint}`);
  })
},

 delete: (req, res, next) => {
  let id = req.params.id;
  api.delete(endpoint, {_id: id}).then(() => {
    req.flash("success", "Deletion successful!");
    res.redirect(`${urlPrefix}/${endpoint}`);
  }).catch(err => {
    req.flash("error", err);
    res.redirect(`${urlPrefix}/${endpoint}`);
  })
 }
}