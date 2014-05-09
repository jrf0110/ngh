var child = require('child_process');
var utils = module.exports = {};

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