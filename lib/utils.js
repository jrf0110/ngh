var utils       = module.exports = {};

var fs          = require('fs');
var child       = require('child_process');
var config      = require('../config');

utils._         = require('lodash');
utils.async     = require('async');
utils.editorIn  = require('editor-in');
utils.color     = require('cli-color');
utils.ghauth    = require('ghauth');

utils._.extend( utils, utils._ );

utils.getCurrentRepositoryUrl = function( callback ){
  var command = ['git', 'config', '--get', 'remote.origin.url'].join(' ');
  child.exec( command, function( error, stdout, stderr ){
    if ( error ) return callback( error );
    if ( stderr ) return callback( stderr );

    return callback( null, stdout.trim().replace( /\n/g, '' ) );
  });
};

utils.getCurrentRepositoryInfo = function( callback ){
  utils.getCurrentRepositoryUrl( function( error, url ){
    if ( error ) return callback( error );

    child.exec( ['git', 'branch'].join(' '), function( error, stdout, stderr ){
      if ( error ) return callback( error );
      if ( stderr ) return callback( stderr );

      var head = stdout.match( /\*\ .+/ );

      head = head.length > 0 ? head[0] : 'master';

      head = head.replace( '* ', '' );

      var info = {
        // TODO: actually use some regex
        organization: url.split(':')[1].split('/')[0]
      , name:         url.split(':')[1].split('/')[1].split('.git')[0]
      , head:         head
      };

      info.repo = info.name;

      return callback( null, info );
    });
  });
};

utils.getIssueEditor = function( content, callback ){
  if ( typeof content === 'function' ){
    callback = content;
    content = null;
  }

  var options = {
    tmpFilePrefix:  'issue-'
  , tmpFilePostfix: '.markdown'
  , content:        content || ''
  };

  utils.editorIn( options, callback );
};

utils.tmpl = function( str, obj ){
  for ( var key in obj ){
    str = str.replace( new RegExp( ':' + key, 'g' ), obj[ key ] );
  }

  return str;
};

utils.padRight = function( str, to ){
  for ( var i = 0; i < to - str.length; i++ ){
    str += ' ';
  }

    return str;
};

utils.truncate = function( str, at, suffix ){
  if ( str.length <= at ) return str;
  return str.substring( 0, at ) + (suffix || '...');
};

utils.padding = function( l ){
  return new Array( l ).join(' ');
};

utils.parseTitleBodyFromText = function( str ){
  str = str.split('\n');

  return {
    title: str[0].substring().replace( /#\s+/, '' )
  , body:  str.slice( str[1] === '' ? 2 : 1 ).join('\n')
  };
};

utils.openUrl = function( url, callback ){
  child.spawn( 'open', [ url ], callback );
};