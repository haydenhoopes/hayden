const api = require("../api/api");

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
    }
}