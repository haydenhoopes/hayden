const axios = require("axios");

require("dotenv").config();
const root = process.env.haydenApiEndpoint;
if (!root) {console.log("No api endpoint specified.")};

module.exports = {
    scan: (endpoint) => {
            return axios.get(`${root}/s/${endpoint}`);
        },
    pscan: (endpoint, per_page=undefined) => {
        if (per_page) { 
            per_page = "?per_page=" + per_page;
            return axios.get(`${root}/p/${endpoint}${per_page}`);    
        } else {
            return axios.get(`${root}/p/${endpoint}`);
        }
    },

    qscan: (endpoint) => {
        return axios.get(`${root}/q/${endpoint}`);
    },
    
    get: (endpoint, id) => {
        return axios.get(`${root}/${endpoint}/${id}`);
    },

    create: (endpoint, data) => {
        return axios.post(`${root}/${endpoint}/post`, data, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.token
            }
        });
    },

    update: (endpoint, data) => {
        // Update data needs to include the '_id' field or it won't be able to automatically parse it out.
        return axios.post(`${root}/${endpoint}/update`, data, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.token
            }
        });
    },

    delete: (endpoint, data) => {
        return axios.post(`${root}/${endpoint}/delete`, data, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.token
            }
        });
    },
}
