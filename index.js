'use strict';

/* USE WITH CAUTION  -  POC ATM */

/**
 * Splits array on AND, OR, NOT and IN
 * @param  {string} query  a lucene query
 *            - http://lucene.apache.org/core/2_9_4/queryparsersyntax.html
 * @return {array}       array of the query, excluding operators.
 */
function doSplit(query) {
  return query.split(/AND|OR|IN|NOT*/g);
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
  console.log('ds', doSplit(query).length - 1 );
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
 * replaceKeys('bacon AND creator:simon', {creator: '_creator'});
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
  var arr = doSplit(query);
  console.log('arr is', arr.length);

  for(var d = 0; d <= arr.length; d++) {
    if(!arr[d]) {
      break;
    }
    var pairs = arr[d].split(':');
    var key = pairs[0].trim() // get rid of white space either side.
    var levels = key.split('.');
    var newLevel = false;

    // check each level for tokens to replace.
    if(levels.length > 1) {
      // not 100% sure this is correct - do we realy want to break up the term?
      var c = levels.length;
      while(c--) {  // see if lookups exist at any level.
        if(lookups[levels[c]]) {
          levels[c] = lookups[levels[c]];
        }
      }
      var newLevel = levels.join('.');
    }

    if (pairs.length > 1 && lookups[key] || newLevel) {
      var newKey = (newLevel) ? newLevel : lookups[key];
      query = query.replace(arr[d], ' ' +  newKey + ':' + pairs[1]);
    }
  }
  return query.trim();
}
