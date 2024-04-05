const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender:{
        type: String,
    },
    dateOfBirth:{
        type: String,
    },
    about:{
        type:String,
    },
    contactNumber:{
        type: Number,
    }
})

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;