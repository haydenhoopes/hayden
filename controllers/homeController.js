const api = require("../api/api");
const s3 = require("../api/s3");

module.exports = {
    index: (req, res, next) => {
        // api.scan("technologies").then((techs) => {
        //     res.locals.technologies = techs.data;
            res.render("index");
        // });
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
            res.json({"status": "error", "message": "There was an error. Check homecontroller line 45"})
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
    },

    profile: async (req, res, next) => {
        let username = res.locals.currentUser.username;
        try {
            let allProfiles = await api.scan("profiles");
            console.log(allProfiles);
            res.render("user/newProfile");
        } catch (error) {
            console.error(error);
            res.send(error);
        }
    }
}