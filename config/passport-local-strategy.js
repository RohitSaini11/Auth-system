const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authenticaton using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
    },
    function(req,email, password, done){
        //find a user ans establish the identity
        User.findOne({email:email})
        .then((user)=>{
            
            // to check the user exist || if exists, password is matching or not(after encrypting the password enterd)
            if(!user){
                req.flash('error','Invalid Username or Password');
                return done(null,false);
            }
            else if( !bcrypt.compareSync(password, user.passwordHash) ){
                req.flash('error','Invalid Username or Password');
                return done(null,false);
            }

            return done(null,user);
        })
        .catch( (err) => {
            console.log('Error in finding user --> Passport');
            return done(err);
        });
    }
));

//serialize the user to decide which key is to be kept in the cookies
passport.serializeUser(function( user, done){
    done(null, user.id);
});

//deserialize the user from the cookies
passport.deserializeUser(function(id, done){

    User.findById(id)
    .then( (user) => {

        return done(null,user);

    })
    .catch( (err) => {
        console.log('Error in finding user --> Passport');
        return done(err);

    });
    
});

//check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    //if the user is signed in, then pass on the request to the next function(controllers's action)
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    return res.redirect('/sign-in');
};

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from session cookies and we are just sending it to views
        res.locals.user = req.user;
    }
    next();
};

module.exports = passport;