/**
 * Created by admin on 7/31/2017.
 */
var assert = require('assert');
var config = require('../config');
var moment      = require('moment');
var CurrentUserTrack = require('../models/CurrentUserTrack').CurrentUserTrack;


module.exports = function(logger){

    var userTrackHistoryController = require('./UserTrackHistoryRecordController')(logger);

    module = {};

    module.GetNearCurrentUserTracks = function (lng, lat, radius, callback) {
        CurrentUserTrack
            .aggregate([
                {
                    $geoNear : {
                        near : {
                            type: "Point",
                            coordinates: [lng, lat]
                        },
                        distanceField : "distance",
                        minDistance : 0,
                        maxDistance : radius,
                        spherical : true
                    }
                },
                {
                    $sort: {
                        'distance': 1
                    }
                }
                ])
            //     .find({
            //         point:
            //             { $near :
            //                 {
            //                     $geometry: { type: "Point",  coordinates: [ lng, lat] },
            //                     $minDistance: 0,
            //                     $maxDistance: radius
            //                 }
            //             }
            //     })
            .exec(function (err, doc) {
                if (err){
                    logger.error(err);
                    callback(null, err);
                }
                else{
                    callback(doc, null);
                }
            });
    }

    module.GetAllCurrentUserTracks = function(callback){
        var query = CurrentUserTrack
            .find({});
        var promise = query.exec();
        assert.ok(promise instanceof require('mpromise'));

        promise.then(function (doc) {
            callback(doc, null);
        });
    };

    module.RemoveOldRecords = function () {
        var curDate = moment().unix();
        CurrentUserTrack.find({
            '$where': curDate + '- this.date >= ' + config.currentUserTrackTimeoutSeconds
        })
            .remove()
            .exec(function(err, doc){
                if (err) console.log(err);
            });
    };

    module.UpdateCurrentUserTrack = function(currentUserTrack, callback){
        console.log(currentUserTrack);
        CurrentUserTrack
            .findOneAndUpdate({
                username: currentUserTrack.username
            }, {
                date: moment().unix(),
                artist: currentUserTrack.artist,
                track: currentUserTrack.track,
                point: {
                    type: "Point",
                    coordinates: currentUserTrack.point.coordinates
                },
                username: currentUserTrack.username,
                uuid: currentUserTrack.uuid,
                battery: currentUserTrack.battery
            }, {
                upsert : true,
                'new': true
            },
            function (error, result){
                if (error) callback(null, result);
                else{
                    userTrackHistoryController.AddNewUserTrackHistoryRecord(result);
                    callback(result, null);
                }
            });

    };

    return module;
}