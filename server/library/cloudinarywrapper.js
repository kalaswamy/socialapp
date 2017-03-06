const cloudinary = require('cloudinary');
const process = require("process");

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

module.exports = {
     upload(src, destinationFolder) {
         return new Promise((resolve, reject) => {
             if (src)
             {
                 cloudinary.uploader.upload(src, (result) =>
                                       { 
                                           console.log(result);
                                           if (result)
                                           {
                                               resolve(result);
                                           } else {
                                               reject(result);
                                           }
                                       }, 
                                       {public_id: destinationFolder});
             } else {
                 resolve(null);
             }
         });
     },
     remove(src) {
         return new Promise((resolve, reject) => {
             if (src)
             {
                 cloudinary.uploader.destroy(src, (result) =>
                                       { 
                                           console.log(result);
                                           if (result)
                                           {
                                               resolve(result);
                                           } else {
                                               reject(result);
                                           }
                                       });
             } else {
                 resolve(null);
             }
         });
     }
}