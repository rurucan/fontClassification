const { join, basename } = require('path');
const { statSync, readdirSync } = require('fs');
const chalk = require('chalk');

const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractText = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const makeRules = require('./util/makeRules');

const { DefinePlugin } = webpack;
const { log } = console;

function getConfig({ product, vendor, dist }) {
  const env = product ? 'production' : 'development';

  // 获取入口文件列表
  const fileList = readdirSync(vendor)
    .filter((item) => {
      const itemPath = join(vendor, item);
      return item.endsWith('.js') && statSync(itemPath).isFile();
    });

  // 根据环境，生成入口文件配置
  const entry = fileList.reduce((pre, current) => {
    const key = basename(current, '.js');
    return { [key]: `./${current}`, ...pre };
  }, {});
  console.log(entry);

  // loaders相关配置
  const ruleOpts = {
    ExtractText,
    isProduct: product,
    fileOpts: {
      publicPath: '/public/',
      outputPath: 'css/',
    },
  };

  // 构建配置
  const config = {
    context: vendor,
    entry,
    output: {
      path: dist,
      publicPath: '/public/',
      filename: join('js/vendor', '[name].js'),
    },
    devtool: 'cheap-module-source-map',
    resolve: {
      extensions: ['.js', '.json', '.jsx'],
    },
    module: {
      rules: makeRules(vendor, ruleOpts),
    },
    plugins: [
      new CleanPlugin(['js/vendor/*'], { root: dist }),
      new DefinePlugin({ 'process.env': { NODE_ENV: `"${env}"` } }),
      new ExtractText({
        filename: join('css', '[name].css'),
        allChunks: true,
      }),
    ],
  };

  if (product) {
    config.plugins.push(new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        output: { comments: false, beautify: false },
        compress: { warnings: false },
      },
    }));
  }

  return config;
}

module.exports = (opts) => {
  const config = getConfig(opts);
  const compiler = webpack(config);
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      log(chalk.red.inverse(' --------我擦：出了一些问题------- '));
    }
    log(stats.toString({ chunks: false, colors: true }));
  });
};
