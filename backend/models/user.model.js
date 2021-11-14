const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name:{type:String,required:true},
    last_name:{type:String,required:true},
    email: { type: String,required:true, unique: true },
    password: { type: String,required:true },
    token: { type: String },
    admin: {type: Boolean,default: false},
    contact: {type: Number},
},
{
    timestamps:true,
}
);


const User = mongoose.model('User',userSchema);

module.exports = User;