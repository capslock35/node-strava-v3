/**
 * Created by austin on 9/18/14.
 */

const util = require('./util');
const BB = require('bluebird');

var athlete = {}
    , _qsAllowedProps = [

        //pagination
        'page'
        , 'per_page'

        //listActivities
        , 'before'
        , 'after'
    ]
    , _updateAllowedProps = [
        'city'
        , 'state'
        , 'country'
        , 'sex'
        , 'weight'
    ];

//===== athlete endpoint =====
athlete.get = function(args) {
  return new BB(function (resolve, reject) {
    var endpoint = 'athlete';
    return resolve(util.getEndpoint(endpoint,args));
  });
};
athlete.listFriends = function(args) {

    return _listHelper('friends',args);
};
athlete.listFollowers = function(args) {

    return _listHelper('followers',args);
};
athlete.listActivities = function(args) {

    return _listHelper('activities',args);
};
athlete.listClubs = function(args) {

    return _listHelper('clubs',args);
};
athlete.listRoutes = function(args) {

    return _listHelper('routes',args);
};
athlete.listZones = function(args) {

    return _listHelper('zones',args);
};

athlete.update = function(args) {

    var endpoint = 'athlete'
        , form = util.getRequestBodyObj(_updateAllowedProps,args);

    args.form = form;
    util.putEndpoint(endpoint,args);
};
//===== athlete endpoint =====

//===== helpers =====
function _listHelper(listType,args) {

  var endpoint = 'athlete/'
      , qs = util.getQS(_qsAllowedProps,args);

  endpoint += listType + '?' + qs;
  return util.getEndpoint(endpoint,args);
};
//===== helpers =====

module.exports = athlete;
