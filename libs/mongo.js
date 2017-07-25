/**
 * Created by admin on 7/25/2017.
 */
var mongoose     = require("mongoose");
var moment      = require('moment');

mongoose.connect(process.env.MONGO_CONNECTION);
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
    username: String
});

var CurrentUserTrack = mongoose.model('CurrentUserTrack', currentUserTrackSchema);

module.exports = {
    CurrentUserTrack: CurrentUserTrack,
    GetAllCurrentUserTracks: function(callback){
        CurrentUserTrack
            .find({})
            .exec(function(error, result){
                if (error) {

                } else {
                    callback(result, null);
                }
            });
    },
    UpdateCurrentUserTrack: function(currentUserTrack){
        CurrentUserTrack.findOneAndUpdate({
            username: currentUserTrack.username
        }, {
            date: moment().unix(),
            artist: currentUserTrack.artist,
            track: currentUserTrack.track,
            lat: currentUserTrack.lat,
            lng: currentUserTrack.lng,
            username: currentUserTrack.username
        }, {
            upsert:true
        }, function (err, item){
            if (err) console.log(err);
        });
    }
}