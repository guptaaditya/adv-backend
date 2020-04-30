const jwt = require('jsonwebtoken');

function getJwt(data, expiresIn) {
    return new Promise((resolve, reject) => {
        jwt.sign({ data }, process.env.tokenKey, { expiresIn }, (err, token) => {
            if (err) 
                reject(err);
            else
                resolve(token); 
        });
    })
}


function verifyJwt(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.tokenKey, (err, decoded) => {
            if (err) 
                reject(err);
            else if (!decoded.data) {
                reject('Token data not found');
            } else
                resolve(decoded.data); 
        });
    })
}

module.exports = {
    getJwt,
    verifyJwt,
};