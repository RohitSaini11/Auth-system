const User = require('../models/user');
const bcrypt = require('bcrypt');


module.exports.home = function(req,res){
    return res.render('home');
}

module.exports.signUp = function(req,res){
    return res.render('signUp');
}

module.exports.signIn = function(req,res){
    return res.render('signIn');
}

module.exports.create = function(req,res){
     try{
        const {email,password,name} = req.body;
        if(req.body.password !== req.body.confirm_password){

            req.flash('error',`Password and Confirm password didn't match!`)
            return res.redirect('back');
        }

        User.create({email, password, name})
        .then((user) =>{
            
            console.log('user registered!'); //remove this later

            req.flash('success','User Registerd, Login to continue');
            return res.redirect('sign-in');
        });
        
     }catch(err){
        console.log(`Error in signin can't create new user ${err}`);
     }
};

module.exports.createSession = function(req, res){
    // logged in successfully notification
    return res.redirect('/');
}

//used for signout btn
module.exports.destroySessoin = function(req,res){
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success',"Logged out successfully!");
        return res.redirect('/sign-in');
    });
}

module.exports.resetPassword = function(req,res){
    return res.render('resetPass');
}

module.exports.changePassword = async function(req,res){
    const user = await User.findOne({ email: req.user.email});
    const {currentPass, newPassword} = req.body;

    if( user ){
        if( !bcrypt.compareSync(currentPass, user.passwordHash) ){
            //show a error notification
            req.flash('error','Incorrect Current Password');
            return res.redirect('back');
        }
        // update the current pass to new pass
        user.passwordHash = bcrypt.hashSync(newPassword, 12);
        user.save();
    }
    //show password changed successfull notification
    req.flash('success','Password Changed Successfully');
    return res.redirect('/');
}