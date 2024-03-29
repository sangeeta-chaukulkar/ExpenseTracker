const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    paymentid : { type : String},
    orderid :  { type : String , required: true },
    status : { type : String , required : true },
    userId : { type : Schema.Types.ObjectId, ref : 'User' ,required : true }
})

module.exports = mongoose.model('Order',orderSchema)