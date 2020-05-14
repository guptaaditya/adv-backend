function Orders(mongoose) {
    const OrdersSchema = new mongoose.Schema({
        username: String,
        paymentFromUser: { type: Object, required: true },
        createdOn: { type: Date, default: Date.now },
        orderDetailsFromPaypal: { type: Object },
    });
    return mongoose.model('Orders', OrdersSchema, 'orders');
}

module.exports = Orders;