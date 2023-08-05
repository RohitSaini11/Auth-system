const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema =  new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    passwordHash:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    }
});

// create a virtual property to set hashed password
userSchema.virtual('password').set(function (value) {
	this.passwordHash = bcrypt.hashSync(value, 12);
});

// function to compare hashed password
// userSchema.methods.isPasswordCorrect = function (password) {
// 	return bcrypt.compareSync(password, this.passwordHash);
// };

const User = mongoose.model('user',userSchema);

module.exports = User;