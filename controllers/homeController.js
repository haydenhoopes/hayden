const api = require("../api/api");
const s3 = require("../api/s3");

module.exports = {
    index: (req, res, next) => {
        res.render("index");
    },

    aboutMe: (req, res) => {
        res.render('aboutMe/aboutMe');
    },

    getTechs: (req, res) => {
        api.scan("technologies").then(data => {
            res.json(data.data);
        }).catch(err => {
            res.json([{'name': "Couldn't get techs."}])
        })
    },

    postTech: (req, res) => {
        let data = JSON.stringify(req.body);
        api.create("technologies", data).then(() => {
            req.flash("success", "Coconuts planted successfully!");
            res.json({"message": "success"});
        }).catch(err => {
            req.flash("error", "Could not add tech");
            res.json({"message": err});
        })
    },

    contact: (req, res) => {
        res.render("user/contact");
      },

    privacy: (req, res) => {
        res.render("user/privacy");
    },

    uploadS3: (req, res, next) => {
        if (!req.files) {
            res.json({"status": "error", "message": "Uploading files is not currently supported on /latest. Please use the manual uploader to upload the S3 object and then attach it to the data object."})
        }
        
        let files = req.files;
        let fileName = Object.keys(files)[0];
        let data = files[fileName].data;
        s3.uploadObject(fileName, data)
            .then(response => {
                res.json(response);
            })
            .catch(err => {
                res.json(err);
            });
    }
}