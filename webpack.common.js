const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, dir)
}

function assetsPath(_path) {
    const assetsSubDirectory = 'static'
    return path.posix.join(assetsSubDirectory, _path)
}

function getEntries(targetPath) {
    let entry = {};
    let fileList = [];
    let key;
    const _getFileList = function(targetPath) {
        let dirFileList = fs.readdirSync(targetPath);
        return dirFileList.forEach(filename => {
            // 排除下划线开头的所有文件和文件夹
            if (/^_/.test(filename)) return
            let _path = path.resolve(targetPath, filename)
            if (fs.statSync(_path).isDirectory()) {
                _getFileList(_path)
            } else {
                if (/\.js$/.test(filename)) {
                    fileList.push({ filepath: _path, filename })
                }

            }
        })
    }
    _getFileList(targetPath);
    fileList.forEach(file => {
        let arr = file.filepath.split(path.sep);
        arr.splice(0, 6)
        arr.pop();
        key = arr.join('-');
        entry[key] = file.filepath;
    });
    return entry;
}

function getHtmlWebpackPlugins(targetPath) {
    let fileList = [];
    let HtmlWebpackPlugins = [];
    const _getFileList = function(targetPath) {
        let dirFileList = fs.readdirSync(targetPath);
        return dirFileList.forEach(filename => {
            // 排除下划线开头的所有文件和文件夹
            if (/^_/.test(filename)) return
            let _path = path.resolve(targetPath, filename)
            if (fs.statSync(_path).isDirectory()) {
                _getFileList(_path)
            } else {
                if (/\.pug$/.test(filename)) {
                    fileList.push({ filepath: _path, filename })
                }

            }
        })
    }
    _getFileList(targetPath);
    fileList.forEach(file => {
        let arr = file.filepath.split(path.sep);
        arr.splice(0, 6)
        arr.pop();
        let key = arr.join('-');
        let reg = /\.[^.]+$/;
        if (reg.test(file.filename)) {
            console.log('.' + file.filepath.replace(targetPath, '').replace(reg, '.html'))
            HtmlWebpackPlugins.push(
                new HtmlWebpackPlugin({
                    template: file.filepath,
                    filename: '.' + file.filepath.replace(targetPath, '').replace(reg, '.html'),
                    chunks: ['vendor', 'common', key],

                })
            )
        }
    })
    return HtmlWebpackPlugins;
}
console.log(resolve('static/img'))
module.exports = {
    resolve: {
        alias: {
            'assets': resolve('assets'),
            'pages': resolve('src/pages'),
            'static': resolve('static'),
            'components': resolve('src/components')
        }
    },
    entry: {
        ...getEntries(path.resolve(__dirname, './src/pages')),
    },
    plugins: [
        new CleanWebpackPlugin(['./server/dist']),
        new MiniCssExtractPlugin({
            filename: "css/[name].[chunkhash:8].css"
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: './src/pages/index/index.pug',
            filename: 'index.html',
            chunks: ['vendor', 'common', 'index']
        }),
        ...getHtmlWebpackPlugins(path.resolve(__dirname, './src/pages')),
        new CopyWebpackPlugin([{
            from: resolve('./static/img'),
            to: resolve('dist/static/img'),
            toType: 'dir'
          }]), 
    ],
    output: {
        filename: 'js/[name].[chunkhash:8].js',
        path: path.resolve(__dirname, './server/dist'),
        chunkFilename: "[name].chunk.js"
    },
    module: {
        rules: [{
                test: /\.pug$/,
                use: [{
                        loader: 'html-loader'
                    },
                    {
                        loader: 'pug-html-loader??pretty=true',
                    }
                ]
            }, {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }, {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    { loader: 'file-loader' },
                    {
                        loader: 'url-loader',
                        options: {
                            name: assetsPath('img/[name].[hash:7].[ext]'),
                            limit: 10000,
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ]
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                // 注意: priority属性
                // 其次: 打包业务中公共代码
                common: {
                    name: "common",
                    chunks: "all",
                    // minSize: 1,
                    // priority: 0,
                    minChunks: 2
                },
                // 首先: 打包node_modules中的文件
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    // priority: 10
                    minChunks: 1
                        // enforce: true
                }
            }
        }
    }
};