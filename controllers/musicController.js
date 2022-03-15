
const endpoint = "music";

module.exports = {
    all: (req, res) => {
        res.render(`${endpoint}/all`);
    }
}