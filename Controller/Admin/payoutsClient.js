const payoutsNodeJssdk = require('@paypal/payouts-sdk');
const { getClient } = require('../Paypal/helper');

async function sendPayouts(payoutsObject) {
    const client = getClient(payoutsNodeJssdk);
    let request = new payoutsNodeJssdk.payouts.PayoutsPostRequest();
    request.requestBody(payoutsObject);
    let response = await client.execute(request);
    console.log(`Response: ${JSON.stringify(response)}`);
    console.log(`Payouts Create Response: ${JSON.stringify(response.result)}`);
    return response.result;
}

module.exports = { sendPayouts };