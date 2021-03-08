const admin = require('firebase-admin')
require('firebase/storage');


var serviceAccount = JSON.parse(process.env.GOOGLE_FIREBASE_AUTH);
//var serviceAccount = require('./learnscapingunc-58b67-firebase-adminsdk-k2h1c-447a3c6687.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = admin.storage();
// Create a storage reference from our storage service
var storageRef = storage.bucket('gs://learnscapingunc-58b67.appspot.com');


exports.getLinkToFile = function(filename) {
    const urlOptions = {
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 4, // 4 hours
      }
    return storageRef.file(filename).getSignedUrl(urlOptions).then((response) => {
        return response[0];
    }).catch(error => {
        console.log(error);
        throw error;
    });
}


function uploadFile(filename) {
    return storageRef.upload(filename).then((response) => {
        console.log("file uploaded")
    }).catch((err) => {
        console.log(err)
    })
}
