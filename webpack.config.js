var path = require('path')
var webpack = require('webpack')
var fs = require('fs')

var appBasePath = './OidcDebugger/Views/'

var jsEntries = {}
// We search for index.js files inside basePath folder and make those as entries
fs.readdirSync(appBasePath).forEach(function (name) {
    var indexFile = appBasePath + name + '/index.js'
    if (fs.existsSync(indexFile)) {
        jsEntries[name] = indexFile
    }
})

module.exports = {
    entry: jsEntries,
    output: {
        path: path.resolve(__dirname, './OidcDebugger/wwwroot/bundle/'),
        publicPath: '/OidcDebugger/wwwroot/bundle/',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.join(__dirname, appBasePath)
        }
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
                        sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.output.filename = '[name].min.js'
  module.exports.devtool = '#source-map'

  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
      new webpack.DefinePlugin({
          'process.env': {
              NODE_ENV: '"production"'
          }
      }),
      new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false
          }
      })
  ])
}
