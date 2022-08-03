const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
   date:        {type: String},
   time:        {type: String},
   isAvailable: {type:Boolean , default:true},
   userId:      {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
});

const appointment = mongoose.model('appointment', appointmentSchema);
module.exports = appointment;
