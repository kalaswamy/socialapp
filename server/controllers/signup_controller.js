

module.exports = {

    index(req, res, next) {
       res.render('signup', { signup_active: 'true' });
    },

    create(req, res, next) {
        console.log (req.body);

        if(req.file){
            console.log('Uploading File...');
            var profileimage = req.file.filename;
            console.log(profileimage);
        } else {
            console.log('No File Uploaded...');
            var profileimage = 'noimage.jpg';
        }

        req.checkBody('FName','First Name field is required').notEmpty();
        req.checkBody('LName','Last Name field is required').notEmpty();
        req.checkBody('Address','Address field is required').notEmpty();
        req.checkBody('email','Email field is required').notEmpty();
        req.checkBody('email','Email - ' +  req.body.email + ' is not valid.').isEmail();
        req.checkBody('pwd','password field is required').notEmpty();
        req.checkBody('pwd1','Passwords do not match').equals(req.body.pwd);

        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                res.render('signup', {errors : error.array()});
            }
            else {
                res.redirect('/login');
            }
        });   
    }

};