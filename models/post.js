const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchme = new mongoose.Schema({
    title :{
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    photo : {
        type : String,
        required : true
    },
    likes : [{
        type : ObjectId,
        ref : "User"
    }],
    comments : [{
        text : String,
        posttedBy :{
            type : ObjectId,
            ref : "User"
        }
    }],
    posttedBy :{
        type : ObjectId,
        ref : "User"
    }
})

mongoose.model("Post",postSchme)