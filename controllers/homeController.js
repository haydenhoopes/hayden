module.exports = {
    index: (req, res, next) => {
        res.render("index");
    },

    aboutMe: (req, res) => {
        res.render('aboutMe/aboutMe');
    }
}