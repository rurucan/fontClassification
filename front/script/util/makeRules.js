function makeRules(src, opts = {}) {
  const { ExtractText, fileOpts = {}, isProduct = false } = opts;

  const makeExtract = () => {
    const cssLoaders = [{
      loader: 'css-loader',
      options: { minimize: isProduct },
    }];
    if (isProduct) cssLoaders.push('postcss-loader');
    const lessLoaders = [...cssLoaders, 'less-loader'];
    const fallback = 'style-loader';

    if (ExtractText) {
      return {
        css: ExtractText.extract({ fallback, use: cssLoaders }),
        less: ExtractText.extract({ fallback, use: lessLoaders }),
      };
    }
    return {
      css: [fallback, ...cssLoaders],
      less: [fallback, ...lessLoaders],
    };
  };

  const jsRule = {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    include: src,
    use: ['babel-loader'],
  };

  const handleStyle = makeExtract();
  const cssRule = {
    test: /\.css$/,
    use: handleStyle.css,
  };
  const lessRule = {
    test: /\.less$/,
    use: handleStyle.less,
  };

  const imgRule = {
    test: /\.(png|jpg|gif)$/,
    use: [{
      loader: 'url-loader',
      options: {
        limit: 8192,
        ...fileOpts,
      },
    }],
  };
  const fontRule = {
    test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
    use: [{
      loader: 'file-loader',
      options: fileOpts,
    }],
  };

  const rules = [jsRule, cssRule, lessRule, imgRule, fontRule];
  return rules;
}

module.exports = makeRules;
