/**
 * Created by sergey.garnov on 7/26/2017.
 */
var packageInfo = require('./../package.json');

var userTrackHistoryController = require('../controllers/UserTrackHistoryRecordController');
var currentUserTrackController = require('../controllers/CurrentUserTrackController');

module.exports = function(app){
    app.get('/', function (req, res) {
        res.json({ version: packageInfo.version });
        userTrackHistoryController.RemoveOldRecords();
        currentUserTrackController.RemoveOldRecords();
    });
    app.get('/api/current/', function (req, res) {
        currentUserTrackController.GetAllCurrentUserTracks(function(result, error){
            if (error){
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
                res.json({status: 'error'})
            }
            else {
                res.json({status: 'ok', item: result})
            }
        });
    });
    app.get('/api/history/:username', function (req, res){
        var username = req.params.username;
        userTrackHistoryController.GetAllUserTrackHistoryRecords(username, function(result, error){
            if (error){
                res.status(500).send({ error: 'Something failed!' })
            }
            else {
                res.json(result);
            }
        });
    });
};