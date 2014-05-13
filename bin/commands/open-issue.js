var config  = require('../../config');
var utils   = require('../../lib/utils');
var github  = require('../../');

module.exports = function( id, options ){
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
      if ( !id ) return next();

      var opts = {
        organization: options.organization
      , repo:         options.repo
      , id:           id
      , state:        'open'
      };

      gh.editIssue( opts, function( error, result ){
        if ( error ){
          throw error;
        }

        console.log('');
        console.log('Issue #' + result.number + ': ' + utils.color.green('Open') );
        console.log( result.title );
        console.log('');
      });
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

        console.log('');
        console.log('Issue #' + result.number + ': ' + utils.color.green('Open') );
        console.log( result.title );
        console.log( utils.color.underline( result.html_url ) );
        console.log('');
        process.exit(0);
      });
    }
  ]);
};