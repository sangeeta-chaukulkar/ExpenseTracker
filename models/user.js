const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name : { type : String, required: true },
  email : { type : String, required: true },
  phone : { type : Number, required: true },
  password : { type : String, required: true },
  isPremiumUser :  { type : Boolean, required: true }
})

module.exports = mongoose.model('User',userSchema)