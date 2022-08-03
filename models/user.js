const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const appointment = require('./appointment');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
    userName: {type: String, unique: true, required: [true, 'Please provide Username']},
    password: {type: String, required: [true, 'Please provide Password']},
    userType:  {type: String},
    FirstName: { type: String , default: ' ' },
    LastName: { type: String , default: ' ' },
    DOB: { type: String , default: ' ' },
    HouseNumber: { type: String , default: ' ' },
    StreetName: { type: String , default: ' ' },
    City: { type: String , default: ' ' },
    Province: { type: String , default: ' ' },
    Postal: { type: String , default: ' ' },
    Brand: { type: String , default: ' ' },
    Model: { type: String , default: ' ' },
    Year: { type: String , default: ' ' },
    PlateNumber: { type: String , default: ' ' },
    LicenceNumber: { type: String , default: 'xyz' },
    Image1: { type: String , default: ' ' },
    Image2: { type: String , default: ' ' },
    appointmentId: {type: mongoose.Schema.Types.ObjectId, ref:"appointment"},
    testType:{ type: String, default: ' '},
    testResult:{ type:String, default: ''},
    examinerComment: { type:String, default: ''}
});

userSchema.plugin(uniqueValidator);

// Encryption Goes Here
userSchema.pre('save',function (next) {
    const user = this;
    async function test(data) {
        await bcrypt.hash(data, 10, function(error, hash){
            user.password = hash
            next()
        })
    }
    test(user.password)
});
const user = mongoose.model('user', userSchema);
module.exports = user;
