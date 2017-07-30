const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const config = require('../config').webpack;

let webPackConfig = module.exports = {
    // the base path which will be used to resolve entry points
    context: path.resolve(config.context)
};

// the main entry point for our application's frontend JS
// The important thing to note is that this entry file is the “core” of your frontend JS, i.e. anything not required by this file (or a dependency of something which is required) will never end up in the compiled bundle.
webPackConfig.entry = config.entry;

webPackConfig.output = {
    // this is our app/assets/javascripts directory, which is part of the Sprockets pipeline
    path: path.resolve(config.output.path),
    // the filename of the compiled bundle, e.g. app/assets/javascripts/bundle.js
    //filename: config.development.filename,
    // if the webpack code-splitting feature is enabled, this is the path it'll use to download bundles
    publicPath: config.output.publicPath
};

webPackConfig.externals = config.externals;

webPackConfig.resolve = {
    // tell webpack which extensions to auto search when it resolves modules. With this,
    // you'll be able to do `require('./utils')` instead of `require('./utils.js')`
    extensions: ['.js', '.jsx'],
    // by default, webpack will search in `web_modules` and `node_modules`. Because we're using
    // vendor, we want it to look in there too
    modules: config.modules.includes,
    alias: {}
};

_.forEach(config.alias, (value, key) => {
    webPackConfig.resolve.alias[key] = path.resolve(value);
});

webPackConfig.plugins = [
    new webpack.ProvidePlugin(config.plugins),
    new LodashModuleReplacementPlugin({
        'shorthands': true,
        'cloning': true,
        'collections': true,
        'flattening': true
    })
];

webPackConfig.module = {
    noParse: config.modules.noParse,
    rules: config.rules
};
