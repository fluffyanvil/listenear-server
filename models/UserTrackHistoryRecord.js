/**
 * Created by admin on 7/31/2017.
 */
var mongoose = require("mongoose");
var userTrackHistoryRecord = mongoose.Schema({
    date: Number,
    artist: String,
    track: String,
    username: String,
    uuid: String,
    battery: Number
});
var UserTrackHistoryRecord = mongoose.model('UserTrackHistoryRecord', userTrackHistoryRecord);
module.exports = {
    UserTrackHistoryRecord: UserTrackHistoryRecord
}