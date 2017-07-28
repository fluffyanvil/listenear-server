/**
 * Created by admin on 7/25/2017.
 */
var mongoose     = require("mongoose");
var assert = require('assert');
var moment      = require('moment');

mongoose.connect(process.env.MONGO_CONNECTION, {
    useMongoClient: true
});
var db = mongoose.connection;
db.once('open', function callback () {
    console.log("Connected to DB!");
    var curDate = moment().unix();
    var yesterdayDate = moment().subtract(24, 'hour').unix();

    CurrentUserTrack.find({
        '$where': curDate + '- this.date >= 3600'
    })
    .remove()
    .exec(function(err, doc){
        if (err) console.log(err);
    });

    UserTrackHistoryRecord.find({
        '$where': 'this.date <= ' + yesterdayDate
    })
    .remove()
    .exec(function(err, doc){
        if (err) console.log(err);
    });
});

var currentUserTrackSchema = mongoose.Schema({
    date: Number,
    artist: String,
    track: String,
    lat: Number,
    lng: Number,
    username: String,
    uuid: String,
    battery: Number
});

var userTrackHistoryRecord = mongoose.Schema({
    date: Number,
    artist: String,
    track: String,
    username: String,
    uuid: String,
    battery: Number
})

var CurrentUserTrack = mongoose.model('CurrentUserTrack', currentUserTrackSchema);
var UserTrackHistoryRecord = mongoose.model('UserTrackHistoryRecord', userTrackHistoryRecord);

var AddNewUserTrackHistoryRecord = function(item){
    UserTrackHistoryRecord.create({
        date: item.date,
        artist: item.artist,
        track: item.track,
        username: item.username,
        uuid: item.uuid,
        battery: item.battery
    })
}

module.exports = {
    GetAllCurrentUserTracks: function(callback){
        var query = CurrentUserTrack
            .find({});
        var promise = query.exec();
        assert.ok(promise instanceof require('mpromise'));

        promise.then(function (doc) {
            callback(doc, null);
        });
    },
    UpdateCurrentUserTrack: function(currentUserTrack, callback){
        CurrentUserTrack.findOneAndUpdate({
            username: currentUserTrack.username
        }, {
            date: moment().unix(),
            artist: currentUserTrack.artist,
            track: currentUserTrack.track,
            lat: currentUserTrack.lat,
            lng: currentUserTrack.lng,
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
                AddNewUserTrackHistoryRecord(result);
                callback(result, null);
            }
        });
    },

    GetAllUserTrackHistoryRecords: function(username, callback){
        var query = UserTrackHistoryRecord
            .find({'username' : username});
        var promise = query.exec();
        assert.ok(promise instanceof require('mpromise'));

        promise.then(function (doc) {
            callback(doc, null);
        });
    }
}