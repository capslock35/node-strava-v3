/**
 * Created by austin on 9/18/14.
 */

var request = require('request')
    , querystring = require('querystring')
    , fs = require('fs')
    , authenticator = require('./authenticator');

const BB = require('bluebird');

//request.debug = true

var util = {
  endpointBase: 'https://www.strava.com/api/v3/',
  rateLimit : 'x-ratelimit-limit',
  rateUsage : 'x-ratelimit-usage'
};

//===== generic GET =====
util.getEndpoint = function(endpoint,args) {

  return new BB(function (resolve, reject) {
    if (!args) {
        args = {};
    }

    var token = args.access_token || authenticator.getToken();

    var url = util.endpointBase + endpoint
        , options = {
            url: url
            , json: true
            , headers: {
                Authorization: 'Bearer ' + token
            }
        };

    return resolve(_requestHelper(options));
  });
};

//===== generic PUT =====
util.putEndpoint = function(endpoint,args,done) {

    if (!args) {
        args = {};
    }

    var token = args.access_token || authenticator.getToken();
    if(!token) return done({msg: 'you must include an access_token'});

    //stringify the body object for passage
    var qs = querystring.stringify(args.body);

    var url = util.endpointBase + endpoint
        , options = {
            url: url
            , method: 'PUT'
            , json: true
            , body: qs
            , headers: {
                Authorization: 'Bearer ' + token
            }
        };

    //add form data if present
    if(args.form)
        options.form = args.form;

    return _requestHelper(options,done);
};

//===== generic POST =====
util.postEndpoint = function(endpoint,args,done) {

    if (!args) {
        args = {};
    }

    var token = args.access_token || authenticator.getToken();
    if(!token) return done({msg: 'you must include an access_token'});

    //stringify the body object for passage
    //var qs = querystring.stringify(args.body);

    var url = util.endpointBase + endpoint
        , options = {
            url: url
            , method: 'POST'
            , json: true
            , body: args.body
            , headers: {
                Authorization: 'Bearer ' + token
            }
        };

    //add form data if present
    if(args.form)
        options.form = args.form;

    //add multipart data if present
    if(args.multipart)
        options.multipart = args.multipart;

    return _requestHelper(options,done);
};

//===== generic DELETE =====
util.deleteEndpoint = function(endpoint,args,done) {

    if (!args) {
        args = {};
    }

    var token = args.access_token || authenticator.getToken();
    if(!token) return done({msg: 'you must include an access_token'});

    //stringify the body object for passage
    var qs = querystring.stringify(args.body);

    var url = util.endpointBase + endpoint
        , options = {
            url: url
            , method: 'DELETE'
            , json: true
            , body: qs
            , headers: {
                Authorization: 'Bearer ' + token
            }
        };

    return _requestHelper(options,done);
};

//===== postUpload =====
util.postUpload = function(args,done) {

    var token = args.access_token || authenticator.getToken();
    if(!token) return done({msg: 'you must include an access_token'});

    var url = util.endpointBase + 'uploads'
        , options = {
            url: url
            , method: 'POST'
            , json: true
            , headers: {
                Authorization: 'Bearer ' + token
            }
        };

    var req = request.post(options, function(err, httpResponse, payload) {

            done(err, payload);
    });

    var form = req.form();

    //append the rest of the formData values
    for(var key in args.formData) {
        form.append(key, args.formData[key]);
    }
    form.append('file', fs.createReadStream(args.file));
};


//===== get pagination query string =====
util.getPaginationQS = function(args) {

    //setup pagination query args
    var page = typeof args.page !== 'undefined' ? args.page : null
        , per_page = typeof args.per_page !== 'undefined' ? args.per_page : null
        , qa = {}
        , qs;

    if(page)
        qa.page = page;
    if(per_page)
        qa.per_page = per_page;

    qs = querystring.stringify(qa);

    return qs;
};
//===== generic get query string =====
util.getQS = function(allowedProps,args) {

    var qa = {}
        , qs;

    for(var i = 0; i < allowedProps.length; i++) {
        if(args[allowedProps[i]])
            qa[allowedProps[i]] = args[allowedProps[i]];
    }

    qs = querystring.stringify(qa);
    return qs;
};


//===== get request body object =====
util.getRequestBodyObj = function(allowedProps,args) {

    var body = {};

    for(var i = 0; i < allowedProps.length; i++) {
        if(args[allowedProps[i]])
            body[allowedProps[i]] = args[allowedProps[i]];
    }

    return body;
};


//===== helpers =====
function _requestHelper(options) {
  return new BB(function (resolve, reject) {
    request(options, function (err, response, payload) {
      if (err) {
        console.log('api call error');
        reject(err);
      }
      resolve(err, payload, parseRateLimits(response.headers));
    });
  });
};

function parseRateLimits(headers) {
    if(!headers[util.rateLimit] || !headers[util.rateUsage]) {
        return null;
    }

    var limit = headers[util.rateLimit].split(',')
        , usage = headers[util.rateUsage].split(',')
        , radix = 10;

    return {
        shortTermUsage: parseInt(usage[0], radix),
        shortTermLimit: parseInt(limit[0], radix),
        longTermUsage: parseInt(usage[1], radix),
        longTermLimit: parseInt(limit[1], radix)
    };
}
//===== helpers =====

module.exports = util;
