var utils       = module.exports = {};

var fs          = require('fs');
var child       = require('child_process');
var config      = require('../config');

utils.async     = require('async');
utils.editorIn  = require('editor-in');

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

    return callback( null, {
      // TODO: actually use some regex
      organization: url.split(':')[1].split('/')[0]
    , name:         url.split(':')[1].split('/')[1].split('.git')[0]
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