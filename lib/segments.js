/**
 * Created by austin on 9/23/14.
 */

var util = require('./util');
const BB = require('bluebird');

var segments = {}
    , _qsAllowedProps = [

        //pagination
        'page'
        , 'per_page'

        //listSegments
        , 'athlete_id'
        , 'gender'
        , 'age_group'
        , 'weight_class'
        , 'following'
        , 'club_id'
        , 'date_range'
        , 'start_date_local'
        , 'end_date_local'

        //explore
        , 'bounds'
        , 'activity_type'
        , 'min_cat'
        , 'max_cat'
    ];

//===== segments endpoint =====
segments.get = function(args) {

    var endpoint = 'segments/'
        , err = null
        , qs = util.getPaginationQS(args);

    //require segment id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an segment id'};
        return done(err);
    }

    endpoint += args.id;
    return util.getEndpoint(endpoint,args);
};

segments.listStarred = function(args) {

    var qs = util.getQS(_qsAllowedProps,args)
        , endpoint = 'segments/starred?' + qs;

    util.getEndpoint(endpoint,args);
};

segments.listEfforts = function(args) {

    return _listHelper('all_efforts',args);
};

segments.listLeaderboard = function(args) {

    return _listHelper('leaderboard',args);
};

segments.explore = function(args) {

    var qs = util.getQS(_qsAllowedProps,args)
        , endpoint = 'segments/explore?' + qs;

    util.getEndpoint(endpoint,args);
};
//===== segments endpoint =====

//===== helpers =====
var _listHelper = function(listType,args) {

    var endpoint = 'segments/'
        , err = null
        , qs = util.getQS(_qsAllowedProps,args);

    //require segment id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include a segment id'};
        return done(err);
    }

    endpoint += args.id + '/' + listType + '?' + qs;
    return util.getEndpoint(endpoint,args);
};
//===== helpers =====

module.exports = segments;
