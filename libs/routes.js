/**
 * Created by sergey.garnov on 7/26/2017.
 */
var packageInfo = require('./../package.json');



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

    // app.get('/api/near/', function (req, res) {
    //     logger.info('get /api/near/');
    //     var lat = parseFloat(req.query.lat);
    //     var lng = parseFloat(req.query.lng);
    //     var radius = parseInt(req.query.radius);
    //     currentUserTrackController.GetNearCurrentUserTrack(lat, lng, radius, function(result, error){
    //         if (error){
    //             logger.error(error);
    //             res.status(500).send({ error: 'Something failed!' })
    //         }
    //         else{
    //             res.json(result);
    //         }
    //     });
    // });

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