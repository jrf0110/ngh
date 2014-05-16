var fs      = require('fs');
var assert  = require('assert');
var utils   = require('../lib/utils');

describe('utils', function(){
  it ('.getCurrentRepositoryUrl( callback )', function( done ){
    var shouldBe = 'git@github.com:jrf0110/ngh.git';

    utils.getCurrentRepositoryUrl( function( error, name ){
      assert.equal( !error, true );
      assert.equal( name, shouldBe );
      done();
    });
  });

  it ('getCurrentRepositoryInfo( callback )', function( done ){
    var shouldBe = {
      organization: 'jrf0110'
    , name:         'ngh'
    , repo:         'ngh'
    , head:          fs.readFileSync('./current-branch').toString()
    };

    utils.getCurrentRepositoryInfo( function( error, info ){
      assert.equal( !error, true );

      for ( var key in shouldBe ){
        assert.equal( shouldBe[ key ], info[ key ] );
      }

      done();
    });
  });

  it ('.parseTitleBodyFromText( str )', function(){
    var shouldBe = {
      title: 'This is the title'
    , body: 'And this is the body\n> Some other stuff\n__Blah:__\n\n* list\n* list'
    };

    var result = utils.parseTitleBodyFromText(
      [ '# ' + shouldBe.title, '', shouldBe.body ].join('\n')
    );

    for ( var key in shouldBe ){
      assert.equal( shouldBe[ key ], result[ key ] );
    }
  });
});