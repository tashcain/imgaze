let mongoose = require('mongoose');
  
//articles schema

let userComentSchema =  mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
                                   

});

module.exports = mongoose.model('Comments',userComentSchema); 