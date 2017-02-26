const path = require("path");

module.exports = {
     getUploadedFilePath() {
         return path.join(AppRootPath, "/uploads");
     }
}