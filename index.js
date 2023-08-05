const express = require('express');
const env = require('./config/environment');
const path = require('path');
const port = 3000;
const passport =  require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth-strategy');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const customMware= require('./config/middleware');

const app = express();
const db = require('./config/mongoose');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(session({ 
    name: 'Authentication System',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge:(1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup Ok')
        })
}));

app.use(express.static(env.asset_path));
app.use(express.urlencoded());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());//created here because connect-flash uses session cookies
app.use(customMware.setFlash);

//router
app.use('/', require('./router'));



app.listen(port, function(err){
    if(err){
        console.log(`Error in starting server : ${err}`);
    }
    console.log(`Server is up and running on :${port}`);
});