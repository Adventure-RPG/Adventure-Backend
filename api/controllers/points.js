'use strict;'
/**
 * Created by GolemXIV on 13.11.2016.
 */

var db = require('../../config/db');

module.exports = {createFeature, getFeatureByPoint, getFeatureById, updateFeature, delFeature};

function getFeatureByPoint(req, res, next) {
    var latitude = req.swagger.params.latitude.value;
    var longitude = req.swagger.params.longitude.value;
    var altitude = req.swagger.params.altitude.value;

    db.find(latitude, longitude, altitude, function (err, result) {
        if (err != null)
            return res.status(400).send();
        res.json(result);
    });
}

function createFeature(req, res, next) {
    db.create(req.body, function (err, result) {
        if (err != null)
            return res.status(400).send();
        res.json(result);
    })
}

function getFeatureById(req, res, next) {
    var id = req.swagger.params.id.value;
    db.findById(id, function (err, result) {
        if (err != null)
            return res.json(err);
        res.json(result);
    });
}


function updateFeature(req, res, next) {
    var id = req.swagger.params.id.value;
    db.update(id, req.body, function (err, result) {
        if (err != null)
            return res.status(400).send();
        res.json(result);
    });
}

function delFeature(req, res, next) {
    var id = req.swagger.params.id.value;
    db.delete(id, function (err, result) {
        if (err != null)
            return res.status(400).send();
        res.json(result);
    })
}