//
const webpack = require('webpack');
const path = require('path');

//
module.exports = {
    entry: path.resolve(__dirname,'src/main.js'),
    externals: {
        'jquery': 'jQuery',
        'lodash': '_'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jhbru.js',
        library: 'jh'
    }
};
