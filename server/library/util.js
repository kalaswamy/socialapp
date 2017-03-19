const path = require("path");
const Moment = require("moment");

module.exports = {
     getUploadedFilePath() {
         return path.join(AppRootPath, "/uploads");
     },

     generateMessage(name, date, message) {
         let d = Moment(date).format("h:mm a");
         return name + ": " + d + " -" + message;
     }
}