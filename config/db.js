/**
 * Created by GolemXIV on 26.11.2016.
 */
var promise = require('bluebird');
var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);

var settings = {
    user: 'game',
    pass: '7uRCSMeGpP'
};

const connectionString = 'postgres://'+settings.user+':'+settings.pass+'@localhost:5432/game';

var db = pgp(connectionString);

module.exports = function () {
    return {
        // find geometry by point and return as GeoJSON
        findById(id, callback){
            db.oneOrNone("SELECT 'Feature' as type, ST_AsGeoJSON(lg.geo)::json As geometry, row_to_json(lp) " +
                "As properties FROM points As lg INNER JOIN (SELECT id, name from points) As lp ON lg.id = lp.id " +
                "WHERE lg.id = $1;",[id])
                .then(feature => {
                    callback(null, feature)
                })
                .catch(error => {
                    console.log(error);
                    callback(error);
                });
        },
        // find geometry by point and return as GeoJSON
        find(latitude, longitude, altitude, callback){
            db.oneOrNone({
                name: "find-point-by-params",
                text: "SELECT 'Feature' as type, ST_AsGeoJSON(lg.geo)::json As geometry, row_to_json(lp) " +
                    "As properties FROM points As lg INNER JOIN (SELECT id, name from points) As lp ON lg.id = lp.id " +
                    "WHERE ST_Contains(lg.geo, ST_GeomFromText($1::text))",
                values: [latitude, longitude, altitude]
            }, null, feature => feature && feature.id)
                .then(feature => {
                    callback(null, feature)
                })
                .catch(error => {
                    console.log(error);
                    callback(error);
                });
        },

        // create geometry from feature
        create(feature, callback){
            db.one("INSERT INTO points(name, geo) VALUES ($1::text, ST_GeomFromGeoJSON($2)) RETURNING id;",
                [feature.properties.name, feature.geometry], point => point.id)
                .then(data => {
                    feature.properties.id = parseInt(data);
                    callback(null, feature);
                })
                .catch(error => {
                    console.log(error);
                    if (error.code == '23505')
                        return callback(new Error("Уже есть в базе."));
                    callback(error);
                });
        },
        update(id, feature, callback){
            db.one("UPDATE points SET geo = ST_GeomFromGeoJSON($1), name = $2::text WHERE id = $3;",
                [feature.geometry, feature.properties.name, id], point => point.id)
                .then(data => {
                    feature.properties.id = parseInt(data);
                    callback(null, feature);
                })
                .catch(error => {
                    console.log(error);
                    callback(error);
                });
        },

        delete(id, callback){
            db.result("DELETE FROM points WHERE id = $1;", [id], r => r.rowCount)
                .then(data => {
                    callback(null, data);
                })
                .catch(error => {
                    console.log(error);
                    callback(error);
                });
        },
        getAll(callback){
            db.one("SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features " +
                "FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geo)::json As geometry, " +
                "row_to_json((SELECT l FROM (SELECT id, name) As l)) As properties FROM points As lg) As f;")
            .then(collection => {
                callback(null, collection);
            })
            .catch(error => {
                console.log(error);
                callback(error);
            });
        },
        // get all geometries in box
        getAllByBox(b_top, b_left, b_right, b_bottom, callback){
            db.one({
                name: "find-point-by-params",
                text: "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features " +
                "FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geo)::json As geometry, " +
                "row_to_json((SELECT l FROM (SELECT id, name) As l)) As properties FROM points As lg " +
                "WHERE lg.geo && BOX3D($1, $2, $3, $4)::box3d) As f;",
                values: [b_top, b_left, b_right, b_bottom]
            })
            .then(collection => {
                callback(null, collection);
            })
            .catch(error => {
                console.log(error);
                callback(error);
            });
        }
    }
};