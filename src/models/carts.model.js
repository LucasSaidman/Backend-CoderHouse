const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: "products",
                required: true
            },
            quantity: {
                type:Number, 
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuarios",
    }
})

cartSchema.pre('findOne', function (next) {
    this.populate('products.product', '_id title price');
    next();
});

const CartModel = mongoose.model("carts", cartSchema);

module.exports = CartModel;