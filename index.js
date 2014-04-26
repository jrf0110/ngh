var qs      = require('querystring');
var request = require('request');
var config  = require('./config');
var errors  = require('./errors');

module.exports.createClient = function( options ){
  if ( !config.token ){
    throw new Error('Access token required!');
  }

  return Object.create({
    userAgent: 'ngh'

  , createRepo: function( name, options, callback ){
      var this_ = this;

      var rbody = {
        name: name
      };

      Object.keys( options ).forEach( function( k ){
        rbody[ k ] = options[ k ];
      });

      var req = {
        url:    config.repoUserUrl
      , method: 'POST'
      , auth:   this.getBasicAuthCredentials()
      , body:   JSON.stringify( rbody )
      , headers: {
          'User-Agent': this_.userAgent
        }
      };

      request( req, function( error, res, body ){
        switch ( res.statusCode ){
          case 404: return callback( errors.repo.NOT_FOUND );
          case 401: return callback( errors.auth.NOT_ALLOWED );
          case 422: return callback( JSON.parse( body ).errors[0].message );
          default:  break;
        }
        return callback( error );
      });
    }

  , removeRepo: function( orgAndName, callback ){
      var this_ = this;

      var req = {
        url:    [ config.repoUrl, orgAndName ].join('/')
      , method: 'DELETE'
      , auth:   this.getBasicAuthCredentials()
      , headers: {
          'User-Agent': this_.userAgent
        }
      };

      request( req, function( error, res, body ){
        switch ( res.statusCode ){
          case 404: return callback( errors.repo.NOT_FOUND );
          case 401: return callback( errors.auth.NOT_ALLOWED );
          default:  break;
        }

        return callback( error );
      });
    }

  , getBasicAuthCredentials: function(){
      return {
        username: config.token
      , password: 'x-oauth-basic'
      };
    }
  });
};