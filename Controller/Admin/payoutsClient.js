const payoutsNodeJssdk = require('@paypal/payouts-sdk');

function getClient() {
    return new payoutsNodeJssdk.core.PayPalHttpClient(environment());
}

function environment() {
    let clientId = process.env.PAYPAL_CLIENT_ID || 'PAYPAL-SANDBOX-CLIENT-ID';
    let clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'PAYPAL-SANDBOX-CLIENT-SECRET';

    if (process.env.NODE_ENV === 'production') {
        return new payoutsNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
    }
    return new payoutsNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);

}

async function sendPayouts(payoutsObject) {
    const client = getClient();
    let request = new payoutsNodeJssdk.payouts.PayoutsPostRequest();
    request.requestBody(payoutsObject);
    let response = await client.execute(request);
    console.log(`Response: ${JSON.stringify(response)}`);
    console.log(`Payouts Create Response: ${JSON.stringify(response.result)}`);
    return response.result;
}

module.exports = { sendPayouts };