/**
 * Created by sergey.garnov on 7/26/2017.
 */
var packageInfo = require('./../package.json');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = function(app, logger){
    var currentUserTrackController = require('../controllers/CurrentUserTrackController')(logger);
    var userTrackHistoryController = require('../controllers/UserTrackHistoryRecordController')(logger);
    app.get('/', function (req, res) {
        logger.info('get /');
        res.json({ version: packageInfo.version });
        userTrackHistoryController.RemoveOldRecords();
        currentUserTrackController.RemoveOldRecords();
    });
    app.get('/api/current/', function (req, res) {
        logger.info('get /api/current/');
        currentUserTrackController.GetAllCurrentUserTracks(function(result, error){
            if (error){
                logger.error(error);
                res.status(500).send({ error: 'Something failed!' })
            }
            else{
                res.json(result);
            }
        });
    });

    app.get('/api/near/', function (req, res) {
        logger.info('get /api/near/', req.query);
        var lat = parseFloat(req.query.lat);
        var lng = parseFloat(req.query.lng);
        var radius = parseInt(req.query.radius);
        currentUserTrackController.GetNearCurrentUserTracks(lng, lat, radius, function(result, error){
            if (error){
                logger.error(error);
                res.status(500).send({ error: 'Something failed!' })
            }
            else{
                res.json(result);
            }
        });
    });

    app.post('/api/current/update', function (req, res) {
        var currentUserTrack = req.body;
        currentUserTrackController.UpdateCurrentUserTrack(currentUserTrack, function(result, error){
            if (error){
                logger.error(error);
                res.json({status: 'error'})
            }
            else {
                res.json({status: 'ok', item: result})
            }
        });
    });

    app.get('/api/random/generate', function(req, res){
        var count = getRandomInt(10, 100);
        var radius = getRandomInt(1, 500);
        var lat = 55.09859635940893;
        var lng = 36.6129714863196;
        currentUserTrackController.GenerateRandomCurrentUserTracks(count, lng, lat, radius, function () {

        });
        res.json({status: 'ok'})
    });

    app.get('/api/history/:username', function (req, res){
        logger.info('get /api/history/ for ', req.params.username);
        var username = req.params.username;
        userTrackHistoryController.GetAllUserTrackHistoryRecords(username, function(result, error){
            if (error){
                logger.error(error);
                res.status(500).send({ error: 'Something failed!' })
            }
            else {
                res.json(result);
            }
        });
    });
};