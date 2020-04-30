function Payments(mongoose) {
    const PaymentsSchema = new mongoose.Schema({
        username: String,
        info: { type: Object, required: true },
        createdOn: { type: Date, default: Date.now },
    });
    return mongoose.model('Payments', PaymentsSchema, 'payments');
}

module.exports = Payments;