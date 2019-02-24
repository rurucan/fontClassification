const { join, basename } = require('path');
const { statSync, readdirSync } = require('fs');
const chalk = require('chalk');

/* ------------------------------------------------------>
 * webpack及相关插件
<-------------------------------------------------------*/
const webpack = require('webpack');
const WebpackServe = require('webpack-dev-server');
const HtmlPlugin = require('html-webpack-plugin');
const HtmlHarddisk = require('html-webpack-harddisk-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractText = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const makeRules = require('./util/makeRules');
const vendorModules = require('./util/externals');

const { DefinePlugin, HotModuleReplacementPlugin } = webpack;
const { log } = console;

function getConfig({ type, src, dist, origin }) {
  const isProduct = type === 'build';
  const env = isProduct ? 'production' : 'development';
  const publicPath = isProduct ? '/' : `${origin}/assets`;

  // 获取入口文件列表
  const fileList = readdirSync(src)
    .filter((item) => {
      const itemPath = join(src, item);
      return item.endsWith('.js') && statSync(itemPath).isFile();
    });

  // 根据环境，生成入口文件配置
  const entry = fileList.reduce((pre, current) => {
    const key = basename(current, '.js');
    let entryValue;
    if (type === 'hot') {
      entryValue = [
        `webpack-dev-server/client?${origin}/`,
        'webpack/hot/dev-server',
        `./${current}`,
      ];
    } else if (type === 'live') {
      entryValue = [
        `webpack-dev-server/client?${origin}/`,
        `./${current}`,
      ];
    } else {
      entryValue = `./${current}`;
    }
    return { [key]: entryValue, ...pre };
  }, {});
  log(entry);

  // 根据入口文件，生成提取html的配置
  const makeHtml = () => {
    const htmlPlugins = Object.keys(entry).map(file => (
      new HtmlPlugin({
        filename: join('../view', `${file}.nj`),
        template: join('../template', `${file}.html`),
        chunks: [file],
        inject: false,
        alwaysWriteToDisk: !isProduct,
      })
    ));
    if (!isProduct) htmlPlugins.push(new HtmlHarddisk());

    return htmlPlugins;
  };

  // file-loaders相关配置
  const ruleOpts = {
    ExtractText: isProduct ? ExtractText : false,
    isProduct,
    fileOpts: {
      outputPath: 'img/',
    },
  };

  // 根据后缀不同来区分生产和开发环境，加载不同的文件
  const extOpts = isProduct ? ['.pro.js'] : ['.dev.js'];

  // 构建配置
  const config = {
    context: src,
    entry,
    output: {
      path: dist,
      publicPath,
      filename: join('js', '[name].js'),
    },
    devtool: isProduct ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',
    resolve: {
      extensions: [...extOpts, '.js', '.json', '.jsx'],
      alias: {
        '@render': join(src, './'),
      },
    },
    externals: vendorModules,
    module: {
      rules: makeRules(src, ruleOpts),
    },
    plugins: [
      new CleanPlugin(['js/*.js', 'js/*.js.map'], { root: dist }),
      new DefinePlugin({ 'process.env': { NODE_ENV: `"${env}"` } }),
      ...makeHtml(),
    ],
  };

  // 相关插件配置
  if (type === 'hot') {
    config.plugins.unshift(new HotModuleReplacementPlugin());
  }
  if (isProduct) {
    config.plugins.push(new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        output: { comments: false, beautify: false },
        compress: { warnings: false },
      },
    }));
    config.plugins.push(new ExtractText({
      filename: join('css', '[name].css'),
      allChunks: true,
    }));
  }

  // 开发环境server配置
  const devOption = {
    publicPath,
    contentBase: dist,
    hot: type === 'hot',
    stats: { colors: true, chunks: false },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    watchOptions: { aggregateTimeout: 1000, ignored: /node_modules/ },
  };

  return { config, devOption };
}

module.exports = ({ type, host, port, render: src, dist }) => {
  const origin = `http://${host}:${port}`;
  const { config, devOption } = getConfig({ type, src, dist, origin });
  const show = config.module.rules.forEach
  // log('config', JSON.stringify(config, null, 2));

  const compiler = webpack(config);
  if (type === 'build') {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        log(chalk.red.inverse(' --------我擦：出了一些问题------- '));
      }
      log(stats.toString({ chunks: false, colors: true }));
    });
  } else {
    const server = new WebpackServe(compiler, devOption);
    server.listen(port, host, (err) => {
      if (err) log(chalk.red.inverse(' --------我擦：出了一些问题------- '));
    });
  }
};
