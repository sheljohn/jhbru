'use babel';

const $ = require( 'jquery' );
const _ = require( 'lodash' );
const assert = require( 'assert' );

// ------------------------------------------------------------------------

/**
 * Find the beginning and end of each line in the input text.
 * This implementation includes empty lines, and supports CRLFs.
 *
 * Example:
 * >> str = 'Hello\nWor\rWorld\n\r\n';
 * >> lines = delineate( str )
 * [ { start: 0, end: 5, len: 5, nl: 1 },
 *   { start: 6, end: 15, len: 9, nl: 1 },
 *   { start: 16, end: 16, len: 0, nl: 2 } ]
 * >> lines.forEach( L => console.log(JSON.stringify( str.substring(L.start,L.end) )) );
 * "Hello"
 * "Wor\rWorld"
 * ""
 */
function delineate(txt) {

    // find all newlines
    var re = RegExp('\r?\n','g');
    var line = {};
    var match = null;
    var lines = [];
    var offset = 0;
    while ( match = re.exec(txt) ) {
        line = {
            'start': offset,
            'end': match.index,
            'len': match.index - offset,
            'nl': match[0].length
        };
        lines.push(line);
        offset = line.end + line.nl;
    }

    // if there is no newline at the end of file
    if ( (line.end + line.nl) < txt.length ) {
        lines.push({
            'start': offset,
            'end': txt.length,
            'len': txt.length - offset,
            'len': 0
        });
    }

    return lines;
}

/**
 * Given a set of lines and an absolute position, find the line corresponding to that position.
 */
function pos2line( lines, pos ) {
    var L = 0;
    while ( (L < lines.length) && (pos > lines[L].end) ) L++;
    return L;
}

/**
 * Cut the beginning and end of a string by c chars.
 */
function cutlr( s, c ) {
    s = s || '';
    c = c || 1;
    return s.substring( c, s.length-c );
}

// ------------------------------------------------------------------------

module.exports = {
    'delineate': delineate,
    'pos2line': pos2line,
    'cutlr': cutlr,
    'sha1': require('sha1'),
    'md5': require('md5')
};
