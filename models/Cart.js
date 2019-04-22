const mongoose = require('../helpers/MyMongoose').mongoose;

var Schema = mongoose.Schema;
var schema = new Schema({
    ssid : String, // session id cho guest
    userId : { // userId cho user
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    orders : [
        {
            stt : Number,
            productId: { // Link đến sản phẩm
                type: mongoose.Schema.Types.ObjectId,
                required: true
            }, 
            quantity: { // Số lượng đặt hàng
                type: Number,
                default: 1,
                required: true,
                validate: {
                    validator: v => v > 0,
                    message: props => `quantity must greater than 0!`
                }
            }
        }
    ],
    
});
let Cart = {}
Cart = mongoose.model('Cart', schema);
Cart.methods = {};

Cart.methods.newCart = (Cart) => {
    return new Cart(Cart).save();
};


Cart.methods.addToCart = async (userId, ssid, productId, quantity) => {
    let order = {
        id : Math.random().toString(36).substring(2) + Date.now(),
        productId,
        quantity
    }
    return Cart.updateOne({ $or : [ {userId}, {ssid}] },{ $push : {orders : order}});
};

Cart.methods.removeFromCart = async (userId, ssid, id) => {
    return Cart.updateOne({ $or : [ {userId}, {ssid}] },{ $pull : {orders : {id : id}}});
};

Cart.methods.getCart = async (userId, ssid) => {
    return Cart.findOne({ $or : [ {userId}, {ssid}] });
}

Cart.methods.joinCart = async (from, to) => {
    let cart1 = await Cart.findOne({ _id : from });
    return Cart.updateOne({_id : to}, {$push :  { order : { $each : cart1.orders }}})
}


// export module
module.exports = Cart;