let aws = require("aws-sdk");
aws.config.update({region: 'us-east-1'});

let s3 = new aws.S3();

function uploadObject(key, body, bucket) {
    s3.upload({
        Bucket: bucket || "hayden-ste-bucket",
        Key: key,
        Body: body
    }, (err, data) => {
        if (err) {
            console.error(err);
            return false;
        } else {
            console.log("Upload successful.");
            return true;
        }
    });
}

module.exports = {
    uploadObject: (key, body, bucket) => {
        return new Promise((resolve, reject) => {
            s3.upload({
                Bucket: bucket || "hayden-site-bucket",
                Key: key,
                Body: body
            }, (err, data) => {
                if (err) {
                    reject({"status": "error", "message": err});
                } else {
                    resolve({"status": "success", "message": "Upload successful"});
                }
            });
        }); 
    },

    uploadMultipleObjects: (files, bucket) => {
        for (obj of files) {
            uploadObject(obj.name, obj.data, bucket);
        }
        console.log("All objects uploaded");
        return
    }
}