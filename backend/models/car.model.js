const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const carSchema = new Schema({
    carName:{type:String,required:true},
    model:{type:String,required:true},
    seats:{type:Number,required:true},
    airBags:{type:Number,required:true},
    color:{type:String,required:true},
    transmissionType:{type:String,required:true},
    abs:{type:Boolean,required:true},
    ac:{type:Boolean,required:true},
    powerSteering:{type:Boolean,required:true},
    img:[{data:Buffer,contentType:String}],
    rentCharges:{type:Number,required:true},
    description:{type:String},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    }

},
{
    timestamps:true,
}
);

const Car = mongoose.model('Car',carSchema);

module.exports = Car;