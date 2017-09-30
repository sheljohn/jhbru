'use babel';

const Sha1 = require('sha1');

// ------------------------------------------------------------------------

/**
 * Singleton publish/subscribe hub.
 */
module.exports = (function() {

    const channel = {};

    return {
        publish: (name,data) => {
            let keys = Object.keys(channel[name] || {});
            for ( let i = 0; i < keys.length; i++ )
                channel[name][ keys[i] ](data);
        },
        subscribe: (name,fun) => {
            if ( ! channel[name] ) {
                channel[name] = {};
            }
            let id = name + ':' + Sha1(JSON.stringify(fun));
            channel[name][id] = fun;
            return id;
        },
        unsubscribe: (id) => {
            let [name,id] = id.split(':');
            delete channel[name][id];
        }
    };

})();
