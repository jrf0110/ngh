var qs      = require('querystring');
var request = require('request');
var config  = require('./config');
var errors  = require('./errors');
var utils   = require('./lib/utils');

module.exports.createClient = function( options ){
  options = options || {};

  if ( !options.token && !config.token ){
    throw new Error('Access token required!');
  }

  return Object.create({
    userAgent: 'ngh'

  , token: options.token

  , createRepo: function( name, options, callback ){
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
          'User-Agent': this.userAgent
        }
      };

      request( req, function( error, res, body ){
        switch ( res.statusCode ){
          case 404: return callback( errors.repo.NOT_FOUND );
          case 401: return callback( errors.auth.NOT_ALLOWED );
          case 422: return callback( JSON.parse( body ).errors[0].message );
          default:  break;
        }

        return callback( error, JSON.parse( body ) );
      });
    }

  , removeRepo: function( orgAndName, callback ){
      var req = {
        url:    [ config.repoUrl, orgAndName ].join('/')
      , method: 'DELETE'
      , auth:   this.getBasicAuthCredentials()
      , headers: {
          'User-Agent': this.userAgent
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

  , createIssue: function( options, callback ){
      var rbody = {};

      // Issue create properties
      [
        'title', 'body', 'assignee', 'milestone', 'labels'
      ].forEach( function( key ){
        if ( key in options ) rbody[ key ] = options[ key ];
      });

      // Required properties
      [
        'title', 'organization', 'repo'
      ].forEach( function( key ){
        if ( !(key in options) ){
          throw new Error('Missing required first argument property: `' + key + '`');
        }
      });

      var req = {
        url:      utils.tmpl( config.issuesUrl, {
                    owner: options.organization
                  , repo:  options.repo
                  })
      , method:   'POST'
      , auth:     this.getBasicAuthCredentials()
      , body:     JSON.stringify( rbody )
      , headers:  { 'User-Agent': this.userAgent }
      };

      request( req, function( error, res, body ){
        if ( error ){
          return callback( error );
        }

        switch ( res.statusCode ){
          case 404: return callback( errors.repo.NOT_FOUND );
          case 401: return callback( errors.auth.NOT_ALLOWED );
          default:  break;
        }

        return callback( null, JSON.parse( body ) );
      });
    }

  , getIssues: function( options, callback ){
      // Required properties
      [
        'organization', 'repo'
      ].forEach( function( key ){
        if ( !(key in options) ){
          throw new Error('Missing required first argument property: `' + key + '`');
        }
      });

      var req = {
        url:      utils.tmpl( config.issuesUrl, {
                    owner: options.organization
                  , repo:  options.repo
                  })
      , method:   'GET'
      , auth:     this.getBasicAuthCredentials()
      , headers:  { 'User-Agent': this.userAgent }
      };

      request( req, function( error, res, body ){
        if ( error ){
          return callback( error );
        }

        switch ( res.statusCode ){
          case 404: return callback( errors.repo.NOT_FOUND );
          case 401: return callback( errors.auth.NOT_ALLOWED );
          default:  break;
        }

        return callback( null, JSON.parse( body ) );
      });
    }

  , getIssue: function( options, callback ){
      [
        'organization', 'repo', 'id'
      ].forEach( function( key ){
        if ( !(key in options) ){
          throw new Error('Missing required first argument property: `' + key + '`');
        }
      });

      var req = {
        url:    utils.tmpl( config.issueUrl, {
                    owner:  options.organization
                  , repo:   options.repo
                  , id:     options.id
                  })
      , method: 'GET'
      , auth:   this.getBasicAuthCredentials()
      , headers: {
          'User-Agent': this.userAgent
        }
      };

      request( req, function( error, res, body ){
        switch ( res.statusCode ){
          case 404: return callback( errors.repo.NOT_FOUND );
          case 401: return callback( errors.auth.NOT_ALLOWED );
          case 422: return callback( JSON.parse( body ).errors[0].message );
          default:  break;
        }

        return callback( error, JSON.parse( body ) );
      });
    }

  , editIssue: function( options, callback ){
      [
        'organization', 'repo', 'id'
      ].forEach( function( key ){
        if ( !(key in options) ){
          throw new Error('Missing required first argument property: `' + key + '`');
        }
      });

      var rbody = {};

      [
        'title', 'body', 'assignee', 'state', 'milestone', 'labels'
      ].forEach( function( key ){
        rbody[ key ] = options[ key ];
      });

      var req = {
        url:    utils.tmpl( config.issueUrl, {
                    owner:  options.organization
                  , repo:   options.repo
                  , id:     options.id
                  })
      , method: 'PATCH'
      , auth:   this.getBasicAuthCredentials()
      , body:   JSON.stringify( rbody )
      , headers: {
          'User-Agent': this.userAgent
        }
      };

      request( req, function( error, res, body ){
        switch ( res.statusCode ){
          case 404: return callback( errors.repo.NOT_FOUND );
          case 401: return callback( errors.auth.NOT_ALLOWED );
          case 422: return callback( JSON.parse( body ).errors[0].message );
          default:  break;
        }

        return callback( error, JSON.parse( body ) );
      });
    }

  , openPullRequest: function( options, callback ){
      [
        'organization', 'repo', 'head', 'base'
      ].forEach( function( key ){
        if ( !(key in options) ){
          throw new Error('Missing required first argument property: `' + key + '`');
        }
      });

      var rbody = {};

      if ( !options.issue )
      if ( !options.title ){
        throw new Error('Missing required first argument property: `title`');
      }

      [
        'issue', 'title', 'body', 'head', 'base'
      ].forEach( function( key ){
        if ( key in options ){
          rbody[ key ] = options[ key ];
        }
      });

      var req = {
        url:    utils.tmpl( config.pullRequestsUrl, {
                    owner:  options.organization
                  , repo:   options.repo
                  })
      , method: 'POST'
      , auth:   this.getBasicAuthCredentials()
      , body:   JSON.stringify( rbody )
      , headers: {
          'User-Agent': this.userAgent
        }
      };

      request( req, function( error, res, body ){

        switch ( res.statusCode ){
          case 404: return callback( errors.repo.NOT_FOUND );
          case 401: return callback( errors.auth.NOT_ALLOWED );
          // Hack for now
          case 422: return callback('Validation failed. Did you specify a branch that exists on remote?');
          default:  break;
        }
        return callback( error, JSON.parse( body ) );
      });
    }

  , getBasicAuthCredentials: function(){
      return {
        username: this.token || config.token
      , password: 'x-oauth-basic'
      };
    }
  });
};