var tmpl    = module.exports = {};

var utils   = require('./utils');

tmpl.issues = {};

tmpl.issues['striped-table'] = function( data ){
  var row = function( issue, i, meta ){
    var stripe = utils.color.bgXterm( i % 2 === 0 ? 232 : 233 );
    var title = utils.truncate( issue.title, 40, '...' );
    
    var firstLine = [
      '#', utils.padRight( issue.number.toString(), meta.greatestLengths.number )
    , ' - ', issue.title
    ].join('');

    return stripe([
      utils.color.white( firstLine )
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

  var out = [], meta = {};

  meta.greatestLengths = {};

  ['number', 'title', 'html_url'].forEach( function( k ){
    meta.greatestLengths[ k ] = data.issues.map( function( issue ){
      return issue[ k ].toString().length;
    }).reduce( function( a, b ){
      return a > b ? a : b;
    });
  });

  out.push('');
  out.push( new Array( process.stdout.columns ).join('=') );
  data.issues.forEach( function( issue, i ){
    out.push( row( issue, i, meta ) );
  });
  out.push( new Array( process.stdout.columns ).join('=') );
  out.push('');

  return out.join('\n');
};

tmpl.issues['json'] = function( data ){
  return JSON.stringify( data.issues );
};