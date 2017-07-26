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
});

var currentUserTrackSchema = mongoose.Schema({
    date: Number,
    artist: String,
    track: String,
    lat: Number,
    lng: Number,
    username: String,
    uuid: String
});

var CurrentUserTrack = mongoose.model('CurrentUserTrack', currentUserTrackSchema);

module.exports = {
    CurrentUserTrack: CurrentUserTrack,
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
            uuid: currentUserTrack.uuid
        }, {
            upsert:true
        }, function (err, item){
            if (err) console.log(err);
        });
    }
}