'use babel';

const $ = require( 'jquery' );
const _ = require( 'lodash' );
const assert = require( 'assert' );

const Text = require('./text.js');
const PubSub = require('./pubsub.js');
const Common = require('./common.js');

// ------------------------------------------------------------------------

/**
 * Get jQuery object with any character in the ID (eg: 'foo:bar-baz').
 */
function getElement( id ) {
    let el = $( document.getElementById(id) || id );
    assert( el.length > 0, 'Element id "' + id + '" does not exist.' );
    return el;
}

/**
 * Get mouse position relative to an element.
 */
function getMousePos(elm, evt, normalise) {
    if (_.isString(elm)) {
        elm = document.getElementById(elm);
    }
    if (!_.isElement(elm)) {
        elm = elm[0];
    }

    var rect = elm.getBoundingClientRect();
    if ( normalise === false ) {
        normX = 1.0;
        normY = 1.0;
    } else {
        normX = rect.right - rect.left;
        normY = rect.bottom - rect.top;
    }

    return {
        x: (evt.clientX - rect.left) / normX,
        y: (evt.clientY - rect.top) / normY
    };
}

/**
 * Shorthand to quickly create new jQuery elements:
 *  o 1 input: class
 *      Create div without id and specified class
 *
 *  o 2 inputs: tab, class
 *      Create element with specified tag and class
 *
 *  o 3 inputs: tag, class, id
 *      Create element with specified tag, class and id
 */
function quickTag(tg, cl, id) {

    if ( !id ) {
        return !cl ?
            $('<div>',{ 'class': tg }) :
            $('<'+tg+'>',{ 'class': cl });
    }
    else return $('<'+tg+'>',{ 'id': id, 'class': cl });
}

/**
 * Create arbitrarily complex jQuery elements from string reprensentation:
 *  tag[css]{properties}
 *
 * Example:
 *  a{class: foo; href:http://google.com}
 */
function stringTag( str, sep ) {

    let innerString = s => { s = s || ''; return s.substring( 1, s.length-1 ); };
    let match = null;
    let elem = undefined;

    if ( match = /([^\[\]{}]+)(\[[^{]*\])?({.*})?/.exec(str) ) {

        let tagName = match[1].trim();
        let cssObj = Common.str2obj(innerString( match[2] ));
        let propObj = Common.str2obj(innerString( match[3] ));

        elem = $( `<${tagName}>`, propObj ).css( cssObj );
    }

    return elem;
}

 /**
 * Parse query string
 * See: http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
 */
function parseQueryString(qstr) {

    // if no query string specified, take it from address bar
    qstr = qstr || window.location.search;
    console.log('[parseQueryString] Parsing: ' + qstr);

    // split into key=value tokens and initialise output
    var parts = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('#')[0].split('&');
    var query = {};

    // record each key and decode value
    for ( var i=0; i < parts.length; i++ ) {
        var pair = parts[i].split('=');
        var key  = pair[0];
        var val  = !pair[1] ? ''
          : decodeURIComponent( pair[1].replace(/\+/g,' ').trim() );

        if ( !query[key] ) {
            query[key] = val;
        } else if (_.isArray(query[key])) {
            query[key].push(val);
        } else {
            query[key] = [query[key], val];
        }
    }

    return query;
}

/**
 * Encode key-press events to string.
 */
function key2str( evt ) {
    return [
        evt.metaKey ? 'META' : '',
        evt.ctrlKey ? 'CTRL' : '',
        evt.altKey ? 'ALT' : '',
        evt.shiftKey ? 'SHIFT' : '',
        String.fromCharCode(evt.keyCode).toUpperCase()
    ].join('+');
}

/**
 * Special wrapper for Textarea elements.
 * Expects a jQuery element in input.
 */
function Textarea( elm ) {

    const uid = Common.randId();
    const dom = elm.get(0);
    let encode = (combo,up) => uid + ':' + 'du'[up+0] + '-' + combo.toUpperCase();

    const obj = {
        jqElement: () => elm,
        domElement: () => dom,
        refocus: () => { elm.blur(); elm.focus(); },
        getText: () => elm.val(),
        setText: (txt) => elm.val(txt),
        insertText: (txt) => {
            elm.focus();
            document.execCommand( 'insertText', false, txt );
        },
        getCursor: getCursor,
        setCursor: pos => { dom.setSelectionRange(pos,pos); },
        setSelection: (first,last) => { dom.setSelectionRange(first,last); },
        setShortcut: ( combo, up, callback ) => {
            return PubSub.subscribe( encode(combo,up || false), callback );
        },
        unsetShortcut: ( combo, up ) => {
            PubSub.unsubscribe( encode(combo,up || false) );
        }
    };

    // bind pubsub to keydown/keyup events
    elm.keydown( e => PubSub.publish( encode(key2str(evt),false), e ) );
    elm.keyup( e => PubSub.publish( encode(key2str(evt),true), e ) );

    //
    function getCursor() {
        let ss = dom.selectionStart;
        let se = dom.selectionEnd;
        return {
            'start': ss,
            'end': se,
            'len': se - ss,
            'sel': se > ss
        };
    }

    return obj;
}

// ------------------------------------------------------------------------

module.exports = {
    'get': getElement,
    'mousePos': getMousePos,
    'parseQS': parseQueryString,
    'qTag': quickTag,
    'sTag': stringTag,
    'Textarea': Textarea
};
