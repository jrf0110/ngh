var config  = require('../../config');
var utils   = require('../../lib/utils');
var github  = require('../../');

var tmpl = function( issue, i, meta ){
  var stripe = utils.color.bgXterm( i % 2 === 0 ? 232 : 233 );

  return stripe([
    '#', utils.padRight( issue.number.toString(), meta.greatestLengths.number )
  , ' - ', issue.title
  , utils.padding(
      Math.abs( process.stdout.columns - issue.title.length - meta.greatestLengths.number - 3 )
    )
  , '\n', utils.padding( meta.greatestLengths.number + 5 )
  , utils.color.xterm(249)( utils.color.underline( issue.html_url ) )
  , utils.padding(
      Math.abs( process.stdout.columns - issue.html_url.length - meta.greatestLengths.number - 3 )
    )
  ].join(''));
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

        var meta = {};

        meta.greatestLengths = {};

        issues.forEach( function( issue ){
          utils.truncate( issue.title, 40, '...' );
        });

        ['number', 'title', 'html_url'].forEach( function( k ){
          meta.greatestLengths[ k ] = issues.map( function( issue ){
            return issue[ k ].toString().length;
          }).reduce( function( a, b ){
            return a > b ? a : b;
          });
        });

        console.log('');
        console.log( new Array( process.stdout.columns ).join('=') );
        issues.forEach( function( issue, i ){
          console.log( tmpl( issue, i, meta ) );
        });
        console.log( new Array( process.stdout.columns ).join('=') );
        console.log('');
      });
    }
  ]);
};