/**
 * Created by sergey.garnov on 8/3/2017.
 */
var log4js = require('log4js');
var mongoAppender = require('log4js-node-mongodb');

log4js.addAppender(
    mongoAppender.appender({connectionString: 'mongodb://log4js:log4js@ds123193.mlab.com:23193/listenear_db'}),
    'listenear'
);
var logger = log4js.getLogger('listenear');
// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Gouda.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');
//
// // log objects
// logger.info({id: 1, name: 'wayne'});
// logger.info([1, 2, 3]);

module.exports = {
    Logger: logger
}