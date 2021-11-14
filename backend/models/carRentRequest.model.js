const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const RentRequestSchema = new Schema({
    carID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        required:true,
    },
    applicantID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    confirmation:{type:Boolean,default:false}

},
{
    timestamps:true,
}
);

const RentRequest = mongoose.model('RentRequest',RentRequestSchema);

module.exports =RentRequest;