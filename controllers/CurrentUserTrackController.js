/**
 * Created by admin on 7/31/2017.
 */
var assert = require('assert');
var config = require('../config');
var moment      = require('moment');
var CurrentUserTrack = require('../models/CurrentUserTrack').CurrentUserTrack;
var userTrackHistoryController = require('./UserTrackHistoryRecordController');

module.exports = {
    GetNearCurrentUserTrack : function(lat, lng, radius, callback){
        CurrentUserTrack
            .find({
                geometry: {
                    $near : {
                            $geometry : {
                                type : 'Point',
                                coordinates : [lat, lng]
                            },
                            $maxDistance : radius
                        }
                }
            })
            .exec(function(err, doc){
                if (err) {
                    console.log(err);
                    callback(null, err);
                }
                else {
                    callback(doc, null);
                }
            });
    },

    GetAllCurrentUserTracks: function(callback){
        var query = CurrentUserTrack
            .find({});
        var promise = query.exec();
        assert.ok(promise instanceof require('mpromise'));

        promise.then(function (doc) {
            callback(doc, null);
        });
    },

    RemoveOldRecords: function () {
        var curDate = moment().unix();
        CurrentUserTrack.find({
            '$where': curDate + '- this.date >= ' + config.currentUserTrackTimeoutSeconds
        })
            .remove()
            .exec(function(err, doc){
                if (err) console.log(err);
            });
    },

    UpdateCurrentUserTrack: function(currentUserTrack, callback){
        console.log(currentUserTrack);
        CurrentUserTrack
            .findOneAndUpdate({
                username: currentUserTrack.username
            }, {
                date: moment().unix(),
                artist: currentUserTrack.artist,
                track: currentUserTrack.track,
                geometry: currentUserTrack.geometry,
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

    },
}