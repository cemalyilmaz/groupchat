function sendSuccess(req, res, next, object) {
    console.log('Object:', JSON.stringify(object, null, 2));
    res.json({
        result: object,
    });
}

function sendError(req, res, next, error) {
    let code = error.code || 500;
    res.status(code).json({error});
}

module.exports.sendSuccess = sendSuccess;
module.exports.sendError = sendError;