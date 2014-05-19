var config  = require('../../config');
var utils   = require('../../lib/utils');
var github  = require('../../');

module.exports = function( id, options ){
  var gh = github.createClient();

  options.id = id;

  utils.async.waterfall([
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
      var opts = {
        id:           id
      , repo:         options.repo
      , organization: options.organization
      };

      gh.getIssue( opts, function( error, issue ){
        if ( error ) throw error;

        if ( options.open ){
          return utils.openUrl( issue.html_url, function(){
            process.exit(0);
          });
        }

        next( null, issue );
      });
    }

  , function( issue, next ){
      var needsEditorOpen = [
        'assignee', 'state', 'milestone', 'labels'
      ].every( function( k ){
        return !(k in options);
      });

      if ( !needsEditorOpen ) return next();

      var content = [
        '# ' + issue.title
      , ''
      , issue.body
      ].join('\n');

      utils.getIssueEditor( content, function( error, result ){
        if ( error ){
          return console.log('No data?');
        }

        result = utils.parseTitleBodyFromText( result.toString() );

        options.title = result.title;
        options.body  = result.body;

        if ( options.title === issue.title )
        if ( options.body === issue.body ){
          return process.exit(0);
        }

        next();
      });
    }

  , function(){
      gh.editIssue( options, function( error, result ){
        // TODO
        if ( error ){
          console.log( error );
          process.exit(1);
        }

        console.log('');
        console.log( 'Issue #' + result.number, utils.color.green('Saved') );
        console.log( utils.color.underline( result.html_url ) );
        console.log('');

        process.exit(0);
      });
    }
  ]);
};