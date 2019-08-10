let mongoose = require('mongoose');
  
//articles schema

let imageSchema = new mongoose.Schema({
    img_name:{
        type:String,
        required: true
    },
    img_title:{
        type:String,
        required: true
    },
    caption:{
        type:String,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    code:{
        type:String
    }
                                   

});

module.exports = mongoose.model('image',imageSchema); 