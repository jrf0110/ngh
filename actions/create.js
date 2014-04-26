var config = require('../config');
var github = require('../');

module.exports = function( name, options ){
  var gh = github.createClient();

  var repo = {
    description:  options.description || ''
  , homepage:     options.homepage || ''
  , private:      options.private === true
  };

  gh.createRepo( name, repo, function( error ){
    if ( error ) throw error;

    console.log( 'Created repository:', name );
    console.log( 'Push an existing repository' );
    console.log( '  git remote add origin git@github.com:jrf0110/ngh.git' );
    console.log( '  git push -u origin master' );
    process.exit(0);
  });
};