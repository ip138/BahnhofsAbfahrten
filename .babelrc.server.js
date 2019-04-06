// @flow
module.exports = {
  comments: false,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10',
        },
        loose: false,
        useBuiltIns: 'entry',
        modules: 'commonjs',
        corejs: 3,
      },
    ],
    '@babel/preset-react',
    '@babel/preset-flow',
    'babel-preset-joblift',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: 'src',
        resolvePath: (sourcePath, currentFile, opts) => {
          const path = require('babel-plugin-module-resolver').resolvePath(
            sourcePath.replace(/^(Abfahrten|Common|Routing)\//, 'client/$1/'),
            currentFile,
            opts
          );
          return path;
        },
      },
    ],
    'dynamic-import-webpack',
    'remove-webpack',
    [
      'transform-require-ignore',
      {
        extensions: ['.scss', '.css'],
      },
    ],
  ],
};
