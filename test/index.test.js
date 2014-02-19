
var assert = require("assert");
var parser = require('../index');

parser.lookups = {
 title: '_title'
}

describe('calculating complexity', function() {
  describe('given a query with complexity of two and an is complexity limit of 1', function() {
    var out;
    before(function(done) {
      var query = 'title:"The Right Way" AND text:go AND hi';
      out = parser.isComplex(query, 1);
      done()
    });
    it('isComplex should return true', function() {
      console.log(out)
      assert.equal(out, true);
    })
  });


  describe('given a query with complexity of one and an is complexity limit of 2', function() {
    var out;
    before(function(done) {
      var query = 'title:"The Right Way" AND text:go';
      out = parser.isComplex(query, 2);
      done()
    });
    it('isComplex should return true', function() {
      console.log(out)
      assert.equal(out, false);
    })
  });
});


describe('given a query with a field name in the lookup table',
  function() {
    var out;
    before(function(done) {
      var query = 'title:"The Right Way" AND text:go AND hi';
      out = parser.replaceKeys(query, {'title': '_title'});
      done();
    });
    it('should replace the field name', function() {
      assert.equal(out, '_title:"The Right Way" AND text:go AND hi')
    });

  }
);


describe('should not replace a value in the lookup (keys only)',
  function() {
    var out;
    before(function(done) {
      var query = 'title:"The Right Way" AND text:title AND hi';
      out = parser.replaceKeys(query, {'title': '_title'});
      done();
    });
    it('should only replace the field name', function() {
      assert.equal(out, '_title:"The Right Way" AND text:title AND hi')
    });
  }
);

describe('given a query with complexity of 0', function() {
  var out;
  before(function(done) {
    var query = 'created: SIMON';
    out = parser.replaceKeys(query, {'created': '_created'});
    done();
  })
  it('should still replace any key values', function() {
    assert.equal(out, '_created: SIMON')
  })
})

// test for white space either side of keys/ maybe values.

describe('examples from the lucene docs: ', function() {
 // title:"The Right Way" AND text:go
 // title:"Do it right" AND right
 // title:Do it right
 // roam~0.8
 // mod_date:[20020101 TO 20030101]
})
