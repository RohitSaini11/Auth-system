const mongoose =  require('mongoose');
const env = require('./environment');

mongoose.connect(`${env.db}`);

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error in connecting to MongoDB."));

db.once('open',function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;