var config  = require('../../config');
var utils   = require('../../lib/utils');
var github  = require('../../');

module.exports = function( options ){
  var gh = github.createClient();

  utils.async.series([
    function( next ){
      if ( !options.organization && !options.repo ){
        utils.getCurrentRepositoryInfo( function( error, info ){
          if ( error ){
            return console.log('Missing required option --organization and --repo');
          }

          options.organization = info.organization;
          options.repo = info.name;

          next();
        });
      } else {
        return next();
      }
    }

  , function( next ){
      if ( !options.title ){
        utils.getIssueEditor( function( error, result ){
          if ( error ){
            return console.log('No data?');
          }

          result = result.toString();

          options.title = result.split('\n')[0];
          options.body = result.split('\n').slice(1).join('\n');

          next();
        });
      } else {
        return next();
      }
    }

  , function(){
      gh.createIssue( options, function( error, result ){
        // TODO
        if ( error ){
          console.log( error );
          process.exit(1);
        }

        console.log( 'Opened Issue #' + result.id, result.title );
        console.log( result.html_url );
        process.exit(0);
      });
    }
  ]);
};