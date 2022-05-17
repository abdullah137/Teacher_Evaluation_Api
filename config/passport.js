const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');

// Loading Our Model
const Admin = require('../models/admin');

module.exports = function(passport) {

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/admin/auth/google/callback'
    }, async(accessToken, refreshToken, profile, done) => {

        console.log(profile);
        const randomOtp = Math.floor(Math.random()*90000)+10000;
    
        const newAdmin = {
            googleId: profile.id,
            firstName: profile.name.familyName,
            lastName: profile.name.givenName,
            email: profile.emails[0].value,
            isAdmin: true,
            password: "Abdullah",
            otpCode: randomOtp,
            isVerified: true,
            profileImg : profile.photos[0].value
        }

        // Encrypting the password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                if(err) throw err;
                newAdmin.password = hash
            })
        });


        // Check into the Databse if record is already there
        try {

            let admin = await Admin.findOne({
                email: profile.emails[0].value
            })

            if(admin) {
                done(null, admin);
            }else {
                admin = await Admin.create(newAdmin)
                done(null, admin)
            }

        } catch(error) {
            console.log("Sorry, An error Occured Here")
        }
    }))

    passport.serializeUser(function(admin, done) {
        done(null, admin.id);
    });

    passport.deserializeUser(function(id, done) {
        Admin.findById(id, function(err, admin) {
            done(err, admin);
        })
    })
}
