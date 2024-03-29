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

    checkYoutube: async (req, res, next) => {
        let link = req.body.link;
        var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        let match = link.match(regExp)[1];
        let dlPath;
        if (process.env.LoginRequired == "false") {
          dlPath = process.env.tmpPath;
        } else {
          dlPath = '/tmp';
        }
        console.log(dlPath);
        let YD = new YoutubeMp3Downloader({
          "ffmpegPath": process.env.ffmpegPath,
          "outputPath": dlPath,
          "youtubeVideoQuality": "highestaudio",
          "queueParallelism": 2,
          "progressTimeout": 2000
        });

        YD.download(match);

        YD.on("error", err => {
          res.json(err);
        });

        YD.on("finished", (err, data) => {
          
          try {
            // upload to s3
            let oPath = path.join(dlPath, `${data.videoTitle}.mp3`)
            let file = fs.readFileSync(oPath);
            s3.uploadObject(`${data.videoTitle}.mp3`, file, 'hayden-music-bucket');
            console.log("File uploaded to s3");

            fs.unlinkSync(path.join(dlPath, `${data.videoTitle}.mp3`));
            console.log(path.join(__dirname, '..', 'public', 'tmp', `${data.videoTitle}.mp3`));
            console.log("file removed from tmp");

            // Get video url in s3
            let vidTitle = data.videoTitle.split("+").join("and")
            vidTitle = vidTitle.split(" ").join("+")
            let downloadUrl = `https://hayden-music-bucket.s3.amazonaws.com/${vidTitle}.mp3`;

            let song = {
              videoId: data.videoId,
              url: data.youtubeUrl,
              title: data.videoTitle,
              thumbnail: data.thumbnail,
              artist: data.artist,
              downloadUrl: downloadUrl
            }
            
              // save details of song to the database
              api.create(endpoint, song);
              console.log("just about to send");
              res.json(song);
          } catch (error) {
            console.log(error);
            res.send(error);
          }
        })
    },
      
       getUpdate: async (req, res, next) => {
         try {
            let id = req.params.id;
            let data = await api.get(endpoint, id);
            res.locals.song = data.data[0];
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