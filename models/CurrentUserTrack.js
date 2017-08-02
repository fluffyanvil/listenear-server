/**
 * Created by admin on 7/31/2017.
 */
var mongoose = require("mongoose");
var currentUserTrackSchema = mongoose.Schema({
    date: Number,
    artist: String,
    track: String,
    geometry: {
        coordinates: { type: [Number], index: '2dsphere'}
    },
    username: String,
    uuid: String,
    battery: Number
});

var CurrentUserTrack = mongoose.model('CurrentUserTrack', currentUserTrackSchema);
module.exports = {
    CurrentUserTrack : CurrentUserTrack
}