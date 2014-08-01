var config  = require('../../config');
var github  = require('../../');
var utils   = require('../../lib/utils');

module.exports = function( name, options ){
  var gh = github.createClient();

  var repo = {
    description:  options.description || ''
  , homepage:     options.homepage || ''
  , private:      options.private === true
  };

  gh.createRepo( name, repo, function( error, r ){
    if ( error ) throw error;

    console.log( 'Created repository:', name );
    console.log( 'Push an existing repository' );
    console.log( '  git remote add origin ' + r.ssh_url );
    console.log( '  git push -u origin master' );

    if ( options.open ){
      return utils.openUrl( r.html_url, function(){
        process.exit(0);
      });
    }

    process.exit(0);
  });
};