'use strict;'
/**
 * Created by GolemXIV on 13.11.2016.
 */

var db = require('../../config/db')();

var Ajv = require('ajv');
var ajv = Ajv({
    schemas: [
        require('../../schemas/geojson/feature.json'),
        require('../../schemas/geojson/geometry.json'),
        require('../../schemas/geojson/bbox.json'),
        require('../../schemas/geojson/crs.json')
    ]
});

function getFeatureById(req, res, next) {
    var id = parseInt(req.params.id);
    db.findById(id, function (err, feat) {
        if (err)
            return next(err);
        if (!feat)
            return next(new Error('Feature not found.'));
        res.status(200).json(feat);
    });
}

function getFeatureByPoint(req, res, next) {
    var latitude = req.params.latitude.value;
    var longitude = req.params.longitude.value;
    var altitude = req.params.altitude.value;

    db.find(latitude, longitude, altitude, function (err, feat) {
        if (err)
            return next(err);
        if (!feat)
            return next(new Error('Feature not found.'));
        res.status(200).json(feat);
    });
}

function createFeature(req, res, next) {
    var validate = ajv.getSchema("http://json-schema.org/geojson/feature.json#");
    var valid = validate(req.body);
    if (!valid)
        return next(validate.errors[0]);
    db.create(req.body, function (err, feat) {
        if (err)
            return next(err);
        res.status(201).json(feat);
    })
}


function updateFeature(req, res, next) {
    var id = parseInt(req.params.id);
    var validate = ajv.getSchema("http://json-schema.org/geojson/feature.json#");
    var valid = validate(req.body);
    if (!valid)
        return next(validate.errors[0]);
    db.update(id, req.body, function (err, feat) {
        if (err)
            return next(err);
        res.status(200).json(feat);
    });
}

function delFeature(req, res, next) {
    var id = parseInt(req.params.id);
    db.delete(id, function (err, result) {
        if (err)
            return next(err);
        res.status(200).json({});
    })
}

function getAll(req, res, next) {
    var b_top = parseInt(req.params.b_top);
    var b_left = parseInt(req.params.b_left);
    var b_right = parseInt(req.params.b_right);
    var b_bottom = parseInt(req.params.b_bottom);
    if (!b_top && !b_left && !b_right && !b_bottom){
        db.getAll(function (err, result) {
            if (err)
                return next(err);
            res.status(200).json(result)
        })
    }else{
        db.getAllByBox(b_top, b_left, b_right, b_bottom, function (err, result) {
            if (err)
                return next(err);
            res.status(200).json(result)
        })
    }
}

module.exports = {
    getAll,
    getFeatureByPoint,
    getFeatureById,
    createFeature,
    updateFeature,
    delFeature
};