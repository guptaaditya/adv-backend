const _ = require('lodash');

function parsePermittedParams(permittedParams, data) {
    const paramsParsed = _.pick(
        data, 
        permittedParams
    );
    const nonEmptyParams = _.pickBy(paramsParsed, (val) => {
        if(_.isBoolean(val) || _.isNumber(val)) return true;
        return _.identity(val);
    }); // Non empty values
    return nonEmptyParams;

}

function hasValidPermittedParams(permittedParams, data) {
    const nonEmptyParams = parsePermittedParams(permittedParams, data);
    _.forEach(nonEmptyParams, (value, key) => {
        nonEmptyParams[key] = _.isString(value) ? _.trim(value) : value;
    });
    return _.values(nonEmptyParams).length ? nonEmptyParams : false;
}


function validate(permittedParams, req, res, mandatoryParams) {
    const nonEmptyParams = hasValidPermittedParams(permittedParams, req.body);
    if (!nonEmptyParams) {
        res.status(400).json({ message: 'No valid value found' });     
        return false;
    }
    req.parsedParams = nonEmptyParams;
    if (mandatoryParams) {
        const missingParam = _.find(
            mandatoryParams, 
            paramName => !_.has(nonEmptyParams, paramName)
        );
        if (missingParam) {
            res.status(400).json({ message: `Bad request. ${missingParam} missing in request`})
            return false;
        }
    }
    return true;
}

module.exports = {
    parsePermittedParams,
    hasValidPermittedParams,
    validate,
}