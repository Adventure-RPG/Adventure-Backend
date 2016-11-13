'use_strict;'
/**
 * Created by GolemXIV on 13.11.2016.
 */
var db = require('../../config/db');

module.exports = {getAll};

function getAll(req, res, next) {
    var b_top = req.swagger.params.b_top.value;
    var b_left = req.swagger.params.b_left.value;
    var b_right = req.swagger.params.b_right.value;
    var b_bottom = req.swagger.params.b_bottom.value;
    db.getAllByBox(b_top, b_left, b_right, b_bottom, function (err, result) {
        if (err != null)
            return res.status(400).send();
        res.json(result)
    })
}