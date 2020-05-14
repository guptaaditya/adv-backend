const paypal = require('@paypal/checkout-server-sdk');
const { getClient } = require('../Paypal/helper');

async function verifyOrder(orderId) {
    const client = getClient(paypal);
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    // Call API with your client and get a response for your call
    const response = await client.execute(request);
    return response.result;
}

module.exports = {
    verifyOrder,
};