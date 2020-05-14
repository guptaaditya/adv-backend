function getClient(paypal) {
    return new paypal.core.PayPalHttpClient(environment(paypal));
}

function environment(paypal) {
    let clientId = process.env.PAYPAL_CLIENT_ID || 'PAYPAL-SANDBOX-CLIENT-ID';
    let clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'PAYPAL-SANDBOX-CLIENT-SECRET';

    if (process.env.NODE_ENV === 'production') {
        return new paypal.core.LiveEnvironment(clientId, clientSecret);
    }
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);

}

module.exports = {
    getClient,
};