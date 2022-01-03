const axios = require("axios");

require("dotenv").config();
const root = process.env.haydenApiEndpoint;
if (!root) {console.log("No api endpoint specified.")};

module.exports = {
    scan: (endpoint) => {
            return axios.get(`${root}/s/${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.token
                }
            });
        },
    pscan: (endpoint, per_page=undefined) => {
        if (per_page) { 
            per_page = "?per_page=" + per_page;
            return axios.get(`${root}/p/${endpoint}${per_page}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.token
                }
            });    
        } else {
            return axios.get(`${root}/p/${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.token
                }
            });
        }
    },

    qscan: (endpoint, query) => { // Just pass in the straight up req.query
        let queryString = "?";
        Object.keys(query).forEach(key => {
            if (Array.isArray(query[key])) {
                query[key].forEach(thing => {
                    queryString += `${key}=${thing}&`;
                })
            } else {
                queryString += `${key}=${query[key]}`;
            }
        })
        return axios.get(`${root}/q/${endpoint}${queryString}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.token
            }
        });
    },
    
    get: (endpoint, id) => {
        return axios.get(`${root}/${endpoint}/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.token
            }
        });
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
