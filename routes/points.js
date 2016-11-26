/**
 * Created by GolemXIV on 26.11.2016.
 */
var express = require('express');
var router = express.Router();

var ctrl = require('../api/controllers/points');

router.get('/api/v1/locations/', ctrl.getAll);
router.get('/api/v1/points/', ctrl.getFeatureByPoint);
router.get('/api/v1/points/:id/', ctrl.getFeatureById);
router.post('/api/v1/points/', ctrl.createFeature);
router.put('/api/v1/points/:id/', ctrl.updateFeature);
router.delete('/api/v1/points/:id/', ctrl.delFeature);

module.exports = router;
