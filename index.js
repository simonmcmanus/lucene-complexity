'use strict';

/* USE WITH CAUTION  -  POC ATM */

/**
 * Splits array on AND, OR, NOT and IN
 * @param  {string} query  a lucene query
 *            - http://lucene.apache.org/core/2_9_4/queryparsersyntax.html
 * @return {array}       array of the query, excluding operators.
 */
function doSplit(query) {
  return query.split(/\sAND\s|\sOR\s|\sIN\s|\sNOT\s*/g);
}

/**
 * Basic complexity checker for lucene queries.
 * @param  {string}  query             The lucene query
 * @param  {int}  allowedComplexity number of AND,OR,NOT and IN operators to
 *                                     allow
 * @return {Boolean}                   is the complexity greater than what is
*                                           allowed
 */
exports.isComplex = function(query, allowedComplexity) {
  return allowedComplexity <= doSplit(query).length - 1;
}


/**
 * Used to replace the field names, based on the mappings provided in lookups.
 *
 * Necessary when the property names exposed are different to those used to
 * to search in lucene.
 *
 * so:
 *
 * replaceKeys('bamov AND creator:simon', {creator: '_creator'});
 *
 * would result in:
 *
 * 'bacon AND _creator:simon'
 *
 *
 * @param  {string} query    lucene query
 * @param  {object} lookups  keys object
 * @return {string}          the updated query
 */
exports.replaceKeys = function(query, lookups) {
  var arr = doSplit(query); // split on and/or
  for(var d = 0; d <= arr.length; d++) {

    if(!arr[d]) {
      break;
    }

    var pairs = arr[d].split(':');
    var end = '';
    var newKey = pairs[0].trim() // get rid of white space either side.
    if(pairs[1]) { // we only actually need to do the lookup when we know we
      // have a value and a key.
      newKey = exports.replaceKey(newKey, lookups);
      end = ':' + pairs[1];
    }
    query = query.replace(arr[d], newKey + end);
  }
  return query.trim();
}

/**
 * Used just a a key.
 * @param  {String} key     The key to lookup, eg '_cm'
 * @param  {Object} lookups The object containing the lookup values eg: {
 *                            _cm: 'meta'
 *                          }
 * @return {String}         the updated value. eg: 'meta'
 */
exports.replaceKey = function(key, lookups) {
  function doCheck(item) {
    if(lookups[item]) {
      return lookups[item];
    }else {
      return item;
    }
  }

  var out;
  var levels = key.split('.');
  if(levels.length > 1) {
    for(var c = 0; c < levels.length; c++) {
      levels[c] = doCheck(levels[c]);
    }
    out = levels.join('.');
  } else {
    out = doCheck(key);
  }
  return out;
};
