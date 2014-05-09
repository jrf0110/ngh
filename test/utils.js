var assert = require('assert');
var utils  = require('../lib/utils');

describe('Utils', function(){
  it ('should get the current repository url', function( done ){
    var shouldBe = 'git@github.com:jrf0110/ngh.git';

    utils.getCurrentRepositoryUrl( function( error, name ){
      assert.equal( !error, true );
      assert.equal( name, shouldBe );
      done();
    });
  });

  it ('should get the current repository info', function( done ){
    var shouldBe = {
      organization: 'jrf0110'
    , name:         'ngh'
    };

    utils.getCurrentRepositoryInfo( function( error, info ){
      assert.equal( !error, true );

      for ( var key in shouldBe ){
        assert.equal( shouldBe[ key ], info[ key ] );
      }

      done();
    });
  });
});