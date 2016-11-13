/**
 * Created by GolemXIV on 13.11.2016.
 */
'use strict;'

module.exports = {ErrorResponse, NotFoundResponse};

function ErrorResponse(res, code, message, fields) {
    res.status(code);
    return res.json({'code':code, 'message': message, 'fields': fields});
}

function NotFoundResponse(res) {
    return ErrorResponse(res, 404, "Not Found.", {});
}