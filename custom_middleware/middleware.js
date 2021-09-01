const jwt = require("jsonwebtoken");

let urlPrefix = process.env.url_prefix;

module.exports = {
    getCookies: (req, res, next) => {
        let access_token = req.cookies.access_token;

        if (access_token == undefined) {
            res.locals.currentUser = undefined;
        } else {
            let decoded = jwt.decode(access_token);
            if (!decoded) {
                res.locals.currentUser = undefined;
            } else {
                let currentUser = {
                    username: decoded.username,
                    client_id: decoded.client_id
                };

                if (currentUser.client_id == "1fbcgp5ageie2cas98dsq65d9o" && decoded.exp > Math.floor(new Date().getTime() / 1000)) { // get time in seconds
                    if (currentUser.username == "haydenhoopes") {
                        currentUser.isAdmin = true;
                        res.locals.currentUser = currentUser;
                    } else {
                        res.locals.currentUser = currentUser;
                    }
                } else {
                    res.locals.currentUser = undefined;
                }
            }
        }
    },

    isLoggedIn: (req, res, next) => {
        if (res.locals.currentUser) {
            next();
        } else {
            res.render("error/notFound");
        }
    },

    isAdmin: (req, res, next) => {
        if (res.locals.currentUser && res.locals.currentUser.isAdmin) {
            next();
        } else {
            res.render("error/notFound");
        }
    },

    decode: (body) => {
        if (Object.keys(body).length === 0) { return {}}
        else {
            let encodedData = Object.keys(body)[0];
            let data = decodeURIComponent(Buffer.from(encodedData, "base64").toString("utf-8")).split("+").join(" ");
            let toReturn = {};
            for (d of data.split("&")) {
                let kv = d.split("=");
                if (kv[0].slice(-2) == "[]") {
                    let k = kv[0].slice(0, -2);
                    if (toReturn.hasOwnProperty(k)) {
                        toReturn[k].push(kv[1])
                    } else {
                        toReturn[k] = [kv[1]];
                    }
                } else {
                    toReturn[kv[0]] = kv[1];
                }
            }
            return toReturn;
        }   
    },

    makeUrl: (rem) => {
        if (!urlPrefix && !rem) { return "/"}
        else if (urlPrefix && !rem) {return urlPrefix}
        else if (!urlPrefix && rem) { return rem}
        else { return urlPrefix + rem}
    }
}

