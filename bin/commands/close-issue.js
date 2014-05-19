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

  , function(){
      var issue = {
        id:           id
      , repo:         options.repo
      , organization: options.organization
      , state:        'closed'
      };

      gh.editIssue( issue, function( error, result ){
        // TODO
        if ( error ){
          console.log( error );
          process.exit(1);
        }

        console.log('');
        console.log('Issue #' + result.number + ': ' + utils.color.red('Closed') );
        console.log( result.title );
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