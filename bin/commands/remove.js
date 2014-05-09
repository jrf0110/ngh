var config = require('../../config');
var github = require('../../');

module.exports = function( name, options ){
  var gh = github.createClient();

  gh.removeRepo( name, function( error ){
    if ( error ) throw error;

    console.log( 'Removed repository:', name );
    process.exit(0);
  });
};