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
        utils.getIssueEditor( '# ', function( error, result ){
          if ( error ){
            return console.log('No data?');
          }

          result = utils.parseTitleBodyFromText( result.toString() );

          options.title = result.title;
          options.body  = result.body;

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