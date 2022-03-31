const api = require("../api/api");
const s3 = require("../api/s3");
const fs = require("fs");
const endpoint = "music";
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const path = require('path');

module.exports = {
    all: (req, res) => {
        api.pscan(endpoint).then(data => {
            res.locals.songs = data.data.Items;
            res.render(`${endpoint}/all`);
        }).catch(err => {
            req.flash("error", err.message);
            console.log(err);
            res.render("index");
        })
    },

    add: (req, res, next) => {
        let data = JSON.stringify(req.body);
    },

    checkYoutube: async (req, res, next) => {
        let link = req.body.link;
        var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        let match = link.match(regExp)[1];
        let YD = new YoutubeMp3Downloader({
          "ffmpegPath": process.env.ffmpegPath,
          "outputPath": path.join(__dirname, '..', 'public', 'tmp'),
          "youtubeVideoQuality": "highestaudio",
          "queueParallelism": 2,
          "progressTimeout": 2000
        });

        YD.download(match);

        YD.on("finished", (err, data) => {
          // Upload the file to S3
          fs.readFile(path.join(__dirname, '..', 'public', 'tmp', `${data.videoTitle}.mp3`), (err, file) => {
            s3.uploadObject(`${data.videoTitle}.mp3`, file, 'hayden-music-bucket');
          })

          // Get video url in s3
          let vidTitle = data.videoTitle.replace(/+/g, "and")
          vidTitle = vidTitle.replace(/ /g, "+")
          let downloadUrl = `https://hayden-music-bucket.s3.amazonaws.com/${vidTitle}.mp3`;

          // Add the video information to the database.
          api.create(endpoint, {
            videoId: data.videoId,
            url: data.youtubeUrl,
            title: data.videoTitle,
            thumbnail: data.thumbnail,
            artist: data.artist,
            downloadUrl: downloadUrl
          }).then(result => {
            return
          }).catch(error => {
            console.log(error);
          });

          res.json(data);
        })

        YD.on("error", err => {
          res.send(err);
        })
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