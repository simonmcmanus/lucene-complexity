
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
      assert.equal(out, true);
    })
  });


  describe('given a query with complexity of two and a max complexity of 2', function() {
    var out;
    before(function(done) {
      var query = 'title:"The Right Way" AND text:go AND hi';
      out = parser.isComplex(query, 2);
      done()
    });
    it('isComplex should return false', function() {
      assert.equal(out, false);
    })
  });

  describe('given a query with complexity of two and an is complexity limit of 3 but with some words like tomorrow in there (containing or)', function() {
    var out;
    before(function(done) {
      var query = 'InformationSecurityClassification_1396538457046:Public AND PublicGoLiveDate_1396538566694:[TOMORROW TO *]';


      out = parser.isComplex(query, 2);
      done()
    });
    it('isComplex should return true', function() {
      assert.equal(out, false);
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



describe('Given a query of meta.common.name:bobi',
  function() {
    var out;
    before(function(done) {
      var query = 'meta.common.name:bobi';
      out = parser.replaceKeys(query, {'meta': '_cm'});
      done();
    });
    it('should only replace the field name', function() {
      assert.equal(out, '_cm.common.name:bobi')
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
});

describe('given a very complicated query with no lots of inconsistant white space', function() {
  var out;
  before(function(done) {
    var query = 'created : SIMON AND time: 123 AND book:bacon in books AND tod :aa';
    out = parser.replaceKeys(query, {
      created: '_created',
      time: '_epoch',
      book: '_book'
    });
    done();
  })
  it('should still replace any key values', function() {
    assert.equal(out, '_created: SIMON AND _epoch: 123 AND _book:bacon in books AND tod:aa')
  })
});

// test for white space either side of keys/ maybe values.

describe('examples from the lucene docs: ', function() {
 // title:"The Right Way" AND text:go
 // title:"Do it right" AND right
 // title:Do it right
 // roam~0.8
 // mod_date:[20020101 TO 20030101]
})


describe('replace key', function() {

  describe('Given a very simple lookup (_cm', function() {
    var out;
    before(function() {
      out = parser.replaceKey('meta', {
        'meta': '_cm'
      });
    })

    it('it should correctly replace the key', function() {
      assert.equal(out, '_cm');
    });
  });

  describe('Given a query with dots _cm.common.name', function() {
    var out;
    before(function() {
      out = parser.replaceKey('meta.common.name', {
        'meta': '_cm'
      });
    })
    it('should replace on the meta with _cm', function() {
      var expected = '_cm.common.name';
      assert.equal(out, expected);
    })
  });
});


// check given a search term with no field.
