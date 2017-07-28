const publicDir = './public';
const assetDir = './app/assets';
const vendorDir = './vendor/assets';
const frontendDir = './node_modules';

module.exports = {
    webpack: {
        context: './app/assets/javascripts',
        entry: {
            ie8: ['./modules/ie8.js'],
            ie9: ['./modules/ie9.js'],
            home: ['./pages/home/home.jsx'],
            'users/show': ['./pages/users/show.jsx'],
            'users/edit': ['./pages/users/edit.jsx'],
            'users/login': ['./pages/users/login.jsx'],
            'users/signup': ['./pages/users/signup.jsx'],
            'users/password': ['./pages/users/password.jsx'],
            'articles/show': ['./pages/articles/show.jsx'],
            'articles/edit': ['./pages/articles/edit.jsx'],
            'tags/show': ['./pages/tags/show.jsx'],
            'errors/error': ['./pages/errors/error.jsx'],
            // 'admin/dashboard': ['./pages/admin/dashboard.jsx'],
            // 'admin/users/index': ['./pages/admin/managers/index.jsx'],
            // 'admin/users/show': ['./pages/admin/managers/show.jsx'],
            // 'admin/errors': ['./pages/admin/managers/errors.jsx']
        },

        commons: [
            {
                name: 'commons',
                files: [
                    'home',
                    'users/show', 'users/edit',
                    'articles/show', 'articles/edit',
                    'tags/show'
                ]
            },
            {
                name: 'commons-full-page',
                files: [
                    'users/login', 'users/signup', 'users/password', 'errors/error'
                ]
            },
            {
                name: 'commons-admin',
                files: [
                    'admin/dashboard',
                    'admin/users/index',
                    'admin/users/show',
                    'admin/errors'
                ]
            }
        ],
        output: {
            path: './public/assets',
            publicPath: '/assets/'
        },
        development: {
            filename: '[name].js',
            commonFilename: '.js'
        },
        production: {
            filename: '[name]-[chunkhash].js',
            commonFilename: '-[chunkhash].js',
            manifestFilename: 'rev-manifest.json'
        },
        modules: {
            includes: [
                'node_modules'
            ]
        },
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    babelrc: true,
                    cacheDirectory: true
                }
            }
        ],
        happyPack: {
            id: 'happyCache',
            loaders: [
                'babel-loader?presets[]=es2015', 'babel-loader?presets[]=react', 'babel-loader?presets[]=stage-2'
            ],
            tempDir: 'tmp/happypack',
            cache: true,
            cachePath: 'tmp/happypack/cache--[id].json',
            threads: 4,
        },
        plugins: {
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery',
            _: 'lodash',
            log: 'loglevel',
            React: 'react',
            ReactDOM: 'react-dom',
            Reflux: 'reflux',
            classNames: 'classnames',
            Promise: 'promise-polyfill'
        }
    },
    browserSync: {
        proxy: {target: 'http://localhost:3001'},
        notify: false,
        open: false
    },
    sass: {
        src: [
            assetDir + '/stylesheets/pages/**/*.scss',
            assetDir + '/stylesheets/**/_*.scss',
            '!**/*_scsslint_tmp*.scss'
        ],
        dest: publicDir + '/assets',
        settings: {
            includePaths: [
                assetDir + '/stylesheets',
                frontendDir,
                vendorDir + '/stylesheets'
            ],
            indentedSyntax: false // use cscc syntax and not sass
        },
        autoPrefixer: ['last 2 version']
    },
    images: {
        src: [
            assetDir + '/images/**/*',
            vendorDir + '/images/**/*'
        ],
        dest: publicDir + '/assets'
    },
    views: {
        src: [
            './app/views/**/*.slim',
            './app/helpers/**/*.rb',
            // './app/controllers/**/*.rb', TODO: BUG Rubymine save file
            // './app/serializers/**/*.rb', TODO: BUG Rubymine save file
            './config/locales/**/*.yml'
        ]
    },
    fonts: {
        src: [
            vendorDir + '/fonts/**/*',
            assetDir + '/fonts/**/*'
        ],
        dest: publicDir + '/assets/fonts'
    },
    data: {
        src: [
            vendorDir + '/data/**/*'
        ],
        dest: publicDir + '/assets/data'
    },
    production: {
        manifestFilename: 'rev-manifest.json',
        dest: publicDir + '/assets'
    },
    clean: [
        publicDir + '/javascripts',
        publicDir + '/stylesheets',
        publicDir + '/images',
        publicDir + '/fonts',
        publicDir + '/assets',
        publicDir + 'rev-manifest.json'
    ],

    // devServer: {
    //     contentBase: path.resolve('./public/assets'),
    //     publicPath: 'http://localhost:8080/assets/',
    //     hot: true
    // }
};
