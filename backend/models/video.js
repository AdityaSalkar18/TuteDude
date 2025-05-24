const mongoose = require('mongoose');


const videoprogressSchema = new mongoose.Schema({

    userid:{
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true    
    },
    videoid:{
        type: String,
        required: true   
    },
    videotitle:{
        type: String,
        required: true
    },
    videolength:{
        type: Number,
        required: true

    },
    videolastWatchedTime:{
        type: Number,
        required: true

    },
    videoprogress:{
        type: Number,
        required: true
    },
    



});

module.exports = mongoose.model('VideoProgress', videoprogressSchema);
