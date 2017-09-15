'use babel';

const $ = require( 'jquery' );
const _ = require( 'lodash' );
const assert = require( 'assert' );

// ------------------------------------------------------------------------

/**
 * Round to given precision
 */
function round(x, dp) {
    dp = dp || 0; // decimal place (works with negative ones)
    fac = Math.pow( 10, dp );
    return Math.round( x*fac )/fac;
}

/**
 * Equivalent of Array.filter method for objects.
 * The predicate argument is a function invoked with (key,value).
 */
function objFilter(obj, predicate) {
    return Object.keys(obj).reduce(
        function (acc, key) {
            if (predicate(key, obj[key]))
                acc[key] = obj[key];
            return acc;
        }, {}
    );
}

/**
 * Compute the set-difference between A and B.
 * That is, find elements in A which are not in B.
 */
function setdiff(A,B) {
    assert( _.isArray(A) && _.isArray(B), '[global.setdiff] Inputs should be arrays.' );
    return A.filter( x => B.indexOf(x) < 0 );
}

/**
 * Convert integer to hexadecimal string.
 */
function dec2hex (dec) {
    return ('0' + dec.toString(16)).substr(-2);
}

/**
 * Generate random ID of given length.
 * By default, length=32.
 */
function generateId(len) {
    var arr = new Uint8Array((len || 32) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('');
}

/**
 * Turn a string like: 'foo:5; bar:Hello!'
 * into an object: {foo: '5', bar: 'Hello!'}
 *
 * Default separator is a semi-colon, but can be set manually.
 * This implementation does _not_ use eval.
 */
function str2obj( str, sep ) {

    let tok = str.trim().split(sep || ';');
    let rekv = /([^:]+):(.*)/;
    let obj = {};

    tok.forEach( t => {
        let kv = null;
        if ( kv = rekv.exec(t) ) {
            obj[ kv[1].trim() ] = (kv[2] || '').trim();
        }
    });

    return obj;
}

// Same but using eval
function estr2obj( str, sep ) {
    return eval( '{' + str.trim().split( sep || ';' ).join(', ') + '}' );
}

// ------------------------------------------------------------------------

module.exports = {
    'round': round,
    'setdiff': setdiff,
    'objfilt': objFilter,
    'dec2hex': dec2hex,
    'randId': generateId,
    'str2obj': str2obj
};
