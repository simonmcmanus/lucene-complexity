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
  console.log('ds' ,query, doSplit(query) );
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
  var c = arr.length;
  while (c--) {
    var pairs = arr[c].split(':');

console.log('---->', lookups[pairs[0]], '"'+pairs[0]+'"');
     // if there is a keypair and the value exists in the lookup obj
    var key = pairs[0].trim() // get rid of white space either side.
    if (pairs.length > 1 && lookups[key]) {

      query = query.replace(arr[c], ' ' + lookups[key] + ':' + pairs[1]);
    }
  }
  console.log('q', query);
  return query;
}
