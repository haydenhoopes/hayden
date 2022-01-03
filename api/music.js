const axios = require("axios");
const url = "https://api.discogs.com/";
require("dotenv").config();

const ck = process.env.discogsConsumerKey || "mfarFAcJQkVgLQidBncG";
const sk = process.env.discogsConsumerSecret || "RTNXMPcpgCnzdynWGIrBZwvquNdllDAp";

module.exports = {
    search: (q) => {
        return axios.get(url + "database/search?q=" + q, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'haydenhoopesaggies',
                'Authorization': `Discogs key=${ck}, secret=${sk}`
            }
        })
    },

    getReleases: (artistId) => {
        return axios.get(url + `artists/${artistId}/releases`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'haydenhoopesaggies',
                'Authorization': `Discogs key=${ck}, secret=${sk}`
            }
        });
    },

    getRelease: (releaseId) => {
        return axios.get(url + `releases/${releaseId}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'haydenhoopesaggies',
                'Authorization': `Discogs key=${ck}, secret=${sk}`
            }
        });
    }
}