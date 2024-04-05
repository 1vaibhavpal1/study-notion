const mongoose = require('mongoose');
require('dotenv').config();

exports.dbConnect = () => {
    mongoose.connect(process.env.DB_URL)
    .then(console.log('db Connected'))
    .catch((err) => {
        console.log("Error in connecting db");
    })
}

