var config  = require('../../config');
var utils   = require('../../lib/utils');
var github  = require('../../');

var tmpl = function( issue ){
  return [
    '#', issue.number, ' - ', issue.title
  , ': ', issue.html_url
  ].join('');
};

module.exports = function( orgname, options ){
  var gh = github.createClient();

  if ( typeof orgName === 'object' ){
    options = orgname;
    orgname = null;
  }

  if ( typeof orgname === 'string' )
  if ( orgname.indexOf('/') === -1 ){
    throw new Error('Invalid organization/name format');
  }

  utils.async.series([
    function( next ){
      if ( orgname ){
        options.organization  = orgname.split('/')[0];
        options.repo          = orgname.split('/')[1];
      }

      if ( options.organization && options.repo ){
        return next();
      }

      utils.getCurrentRepositoryInfo( function( error, info ){
        if ( error ){
          throw error;
        }

        options.organization  = info.organization;
        options.repo          = info.name;

        next();
      });
    }

  , function(){
      gh.getIssues( options, function( error, issues ){
        if ( error ){
          throw error;
        }

        issues.forEach( function( issue ){
          console.log( tmpl( issue ) );
        });
      });
    }
  ]);
};