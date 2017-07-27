/**
 * Created by sergey.garnov on 7/26/2017.
 */
var mongo = require('./mongo');
var packageInfo = require('./../package.json');
module.exports = function(app){

    app.get('/', function (req, res) {
        res.json({ version: packageInfo.version });
    });

    app.get('/api/current/', function (req, res) {
        mongo.GetAllCurrentUserTracks(function(result, error){
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
        mongo.UpdateCurrentUserTrack(currentUserTrack, function(result, error){
            if (error){
                res.json({status: 'error'})
            }
            else{
                res.json({status: 'ok', item: result})
            }
        });
    });

    app.get('/api/history/:username', function (req, res){
        var username = req.params.username;
        mongo.GetAllUserTrackHistoryRecords(username, function(result, error){
            if (error){
                res.status(500).send({ error: 'Something failed!' })
            }
            else{
                res.json(result);
            }
        });
    });
};