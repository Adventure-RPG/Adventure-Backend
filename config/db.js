'use strict;'
/**
 * Created by GolemXIV on 13.11.2016.
 */

const pg = require('pg');

const user = 'game';
const pass = '7uRCSMeGpP';
const connectionString = process.env.DATABASE_URL || 'postgres://'+user+':'+pass+'@localhost:5432/game';

const client = new pg.Client(connectionString);

client.connect(function (err, res) {
    console.log("status:" + res);
});

module.exports= function() {
    return {
        // create geometry from feature
        create(feature, callback){
            client.query("INSERT INTO points(name, geo) VALUES ($1::text, ST_GeomFromGeoJSON($2)) RETURNING id;",
                [feature.properties.name, feature.geometry], function (err, res) {
                    if (err)
                        return callback(err);
                    feature.properties.id = res.rows[0];
                    callback(null, feature);
                });
        },
        // find geometry by point and return as GeoJSON
        find(latitude, longitude, altitude, callback){
            var point = 'POINT('+latitude+' '+longitude+' '+altitude+')';
            client.query("SELECT 'Feature' as type, ST_AsGeoJSON(lg.geo)::json As geometry, row_to_json(lp) " +
                "As properties FROM points As lg INNER JOIN (SELECT id, name from points) As lp ON lg.id = lp.id " +
                "WHERE ST_Contains(lg.geo, ST_GeomFromText($1::text));",[point],
                function (err, res) {
                    if (err)
                        return callback(err);
                    callback(null, res.rows[0]);
                }
            );
        },

        // find geometry by point and return as GeoJSON
        findById(id, callback){
            client.query("SELECT 'Feature' as type, ST_AsGeoJSON(lg.geo)::json As geometry, row_to_json(lp) " +
                "As properties FROM points As lg INNER JOIN (SELECT id, name from points) As lp ON lg.id = lp.id " +
                "WHERE lg.id = $1;",[id],
                function (err, res) {
                    if (err)
                        return callback(err);
                    callback(null, res.rows[0]);
                });
        },

        update(id, feature, callback){
            client.query("UPDATE points SET geo = ST_GeomFromGeoJSON($1), name = $2::text WHERE id = $3;",
                [feature.geometry, feature.properties.name, id], function (err, res) {
                    if (err)
                        return callback(err);
                    feature.properties.id = id;
                    callback(null, feature);
                });
        },

        delete(id, callback){
            client.query("DELETE * FROM points WHERE id=$1;", [id], function (err, res) {
                if (err)
                    return callback(err);
                callback(null, res.rows[0]);
            })
        },

        // get all geometries in box
        getAllByBox(b_top, b_left, b_right, b_bottom, callback){
            if (!b_top && !b_left && !b_right && !b_bottom){
                client.query("SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features " +
                    "FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geo)::json As geometry, " +
                    "row_to_json((SELECT l FROM (SELECT id, name) As l)) As properties FROM points As lg) As f;",
                    function (err, res) {
                        if (err)
                            return callback(err);
                        callback(null, res.rows[0]);
                    })
            }else{
                var box = 'BOX3D('+ b_top + ' '+ b_left + ', '+ b_right + ' '+ b_bottom +')';
                client.query("SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features " +
                    "FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geo)::json As geometry, " +
                    "row_to_json((SELECT l FROM (SELECT id, name) As l)) As properties FROM points As lg " +
                    "WHERE lg.geo && $1::box3d) As f;", [box], 
                    function (err, res) {
                    if (err)
                        return callback(err);
                    callback(null, res.rows[0]);
                })   
            }
        }
    }
};