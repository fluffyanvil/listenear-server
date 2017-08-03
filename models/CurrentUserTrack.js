/**
 * Created by admin on 7/31/2017.
 */
var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require("mongoose");
var currentUserTrackSchema = mongoose.Schema({
    date: Number,
    artist: String,
    track: String,
    point: mongoose.Schema.Types.Point,
    username: String,
    uuid: String,
    battery: Number
});

var CurrentUserTrack = mongoose.model('CurrentUserTrack', currentUserTrackSchema);
module.exports = {
    CurrentUserTrack : CurrentUserTrack
}