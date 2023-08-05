const express = require('express');
const router = express.Router();
const passport = require('passport');

const controller = require('../controller/controller');

console.log( "router loaded" );



router.get('/', passport.checkAuthentication, controller.home);
router.get('/sign-up', controller.signUp);
router.get('/sign-in', controller.signIn);
router.get('/sign-out', controller.destroySessoin);
router.get('/reset-pass', controller.resetPassword);

router.post('/change-pass', controller.changePassword);

router.post('/create', controller.create);
router.post('/create-session', passport.authenticate('local',{failureRedirect: '/sign-in'}), controller.createSession);

router.get('/auth/google/', passport.authenticate('google',{scope:['profile','email']}) );
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/sign-in'}), controller.createSession);
//add the new route after hosting to google console URI{remove this later}


module.exports = router;