const request = require('request');
const { promisifyFunc } = require('../../helper');

const threatTypes  = [
    "THREAT_TYPE_UNSPECIFIED", "MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", 
    "POTENTIALLY_HARMFUL_APPLICATION"];
const platformTypes = [
    "PLATFORM_TYPE_UNSPECIFIED", "WINDOWS", "LINUX", "ANDROID", "OSX", "IOS", 
    "ANY_PLATFORM", "ALL_PLATFORMS", "CHROME"
];
const threatEntryTypes = ["URL", "THREAT_ENTRY_TYPE_UNSPECIFIED", "EXECUTABLE"];
const companyName = "Use The Views";
const clientVersion = "1.0";


async function isUrlAThreat(url) {
    const googleURL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_API_KEY}`;
    const body = {
        client: {
          clientId: companyName,
          clientVersion
        },
        threatInfo: {
          threatTypes,
          platformTypes,
          threatEntryTypes,
          threatEntries: [ { url } ]
        }
    };
    
    const requestObject = {
        url: googleURL,
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    };
    return await promisifyFunc(cb => request(requestObject, function (error, response, body) {
        if(error) {
            cb(null, true);
            return;
        }
        let isMalicious = false;
        if(response.statusCode == 200) {
            let responseBody = response.body.trim();
            responseBody = JSON.parse(responseBody);
            if(responseBody.matches) {
                isMalicious = true;
                cb(null, isMalicious);
                return;
            }
        }
        cb(null, isMalicious);
    }));
}

module.exports = {
    isUrlAThreat,
};