'use strict;'
/**
 * Created by GolemXIV on 13.11.2016.
 */

var db = require('../../config/db')();
var errors = require('./errors');

module.exports = {createFeature, getFeatureByPoint, getFeatureById, updateFeature, delFeature};

function getFeatureByPoint(req, res, next) {
    var latitude = req.swagger.params.latitude.value;
    var longitude = req.swagger.params.longitude.value;
    var altitude = req.swagger.params.altitude.value;

    db.find(latitude, longitude, altitude, function (err, feat) {
        if (err)
            return errors.ErrorResponse(res, 500, err.message, {});
        if (!feat)
            return errors.NotFoundResponse(res);
        res.json(feat);
    });
}

function createFeature(req, res, next) {
    db.create(req.body, function (err, feat) {
        if (err)
            return errors.ErrorResponse(res, 500, err.message, {});
        if (!feat)
            return errors.NotFoundResponse(res);
        res.json(feat);
    })
}

function getFeatureById(req, res, next) {
    var id = req.swagger.params.id.value;
    db.findById(id, function (err, feat) {
        if (err)
            return errors.ErrorResponse(res, 500, err.message, {});
        if (!feat)
            return errors.NotFoundResponse(res);
        res.json(feat);
    });
}


function updateFeature(req, res, next) {
    var id = req.swagger.params.id.value;
    db.update(id, req.body, function (err, feat) {
        if (err)
            return errors.ErrorResponse(res, 500, err.message, {});
        if (!feat)
            return errors.NotFoundResponse(res);
        res.json(feat);
    });
}

function delFeature(req, res, next) {
    var id = req.swagger.params.id.value;
    db.delete(id, function (err, result) {
        if (err)
            return errors.ErrorResponse(res, 500, err.message, {});
        res.json(result);
    })
}