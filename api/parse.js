module.exports = {
    decode: (body) => {
        if (Object.keys(body).length === 0) { return {}}
        else {
            let encodedData = Object.keys(body)[0];
            let data = decodeURIComponent(Buffer.from(encodedData, "base64").toString("utf-8"));
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
        
    }
}