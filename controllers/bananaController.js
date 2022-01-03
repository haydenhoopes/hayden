const api = require("../api/api");
const youtube = require("../api/music");
const endpoint = "bananas";

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

/****  BANANA SCHEMA  ****

table([
    {
        _id: a33sefiejf,
        artist: Rick Astley,
        albums: [
            title: Never Gonna Give You Up,
            tracks: [
                {
                    name: Never Gonna Give You Up,
                    url: http://asdf.youtub.com/asdf
                }
            ]
        ],
        genre: pop,
        lastScanned: 2021-11-08
    }
])
*/

module.exports = {
 all: (req, res, next) => {
    api.pscan(endpoint).then(data => {
      res.locals.bananas = data.data.Items;
      res.render(`${endpoint}/all`);
    }).catch(err => {
      req.flash("error", err.message);
      res.send(err);
    });
 },

 getsingle: async (req, res, next) => {
  let data = await api.get(endpoint, req.params.id);
  res.locals.banana = data.data[0];

  // Date formatting, nothing special
  let date=new Date(data.data[0].p_Date);
  res.locals.banana.Date = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

  // Image format, nothing special
  res.locals.i = req.query.i;

  res.locals.banana.files;
  res.render(`${endpoint}/single`);
 },
 
 getCreate: (req, res, next) => {
     res.render(`${endpoint}/create`);
 },

 postCreate: (req, res, next) => {
   let data = JSON.stringify(req.body);

   api.create(endpoint, data).then(response => {
     req.flash("success", response.data.message);
     res.redirect(`/${endpoint}`);
   }).catch(err => {
     req.flash("error", "Not enough water for the banana: " + err);
     res.redirect(`/${endpoint}`);
   })
},

 getUpdate: async (req, res, next) => {
   try {
      let id = req.params.id;
      let data = await api.get(endpoint, id);
      res.locals.banana = data.data[0];
      res.render(`${endpoint}/update`);
   } catch (error) {
      req.flash("error", error.message);
      res.redirect(`/${endpoint}/${id}`);
   }
 },

 postUpdate: (req, res, next) => {
  let id = req.body._id;
  api.update(endpoint, JSON.stringify(req.body)).then(() => { 
    req.flash("success", "Banana taken care of successfully!");
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