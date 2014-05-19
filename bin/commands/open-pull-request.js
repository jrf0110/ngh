var config  = require('../../config');
var utils   = require('../../lib/utils');
var github  = require('../../');

module.exports = function( id, options ){
  var gh = github.createClient();
  if ( !id ){
    [
      'title'
    ].forEach( function( k ){
      if ( !( k in options ) ){
        console.log('  Missing required option --' + k );
        process.exit(1);
      }
    });
  } else {
    options.issue = id;
  }

  utils.async.series([
    function( next ){
      utils.getCurrentRepositoryInfo( function( error, info ){
        if ( error ){
          console.log('  Missing required option --organization and --repo');
          return process.exit(1);
        }

        [
          'organization', 'repo', 'head'
        ].forEach( function( k ){
          if ( !options[ k ] ) options[ k ] = info[ k ];
        });

        next();
      });
    }

  , function( next ){
      if ( options.issue ) return next();
      if ( options.title ) return next();

      utils.getIssueEditor( '# ', function( error, result ){
        if ( error ){
          return console.log('No data?');
        }

        result = utils.parseTitleBodyFromText( result.toString() );

        options.title = result.title;
        options.body  = result.body;

        next();
      });
    }

  , function(){
      gh.openPullRequest( options, function( error, result ){
        // TODO
        if ( error ){
          console.log( error );
          process.exit(1);
        }

        console.log('');
        console.log('Pull Request #' + result.number + ': ' + utils.color.green('Open') );
        console.log( result.title );
        console.log( utils.color.underline( result.html_url ) );
        console.log('');

        if ( options.open ){
          return utils.openUrl( result.html_url, function(){
            process.exit(0);
          });
        }

        process.exit(0);
      });
    }
  ]);
};