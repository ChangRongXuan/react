const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  babelrcRoots: ['.', 'packages/*'],
  presets: [
    [
      '@babel/preset-env',
      // Compile to npm packages run on Node 14+
      // We can overwrite this option at each package level
      {
        modules: 'commonjs',
        targets: {
          node: '14',
        },
      },
    ],
    [
      '@babel/preset-react',
      {
        development: !isProduction,
        runtime: 'automatic',
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties'],
    ['@babel/plugin-transform-classes'],
    [
      'inline-react-svg',
      {
        svgo: {
          plugins: [
            {
              name: 'removeAttrs',
              params: { attrs: '(data-name)' },
            },
            'cleanupIDs',
          ],
        },
      },
    ],
    [
      'babel-plugin-styled-components',
      { ssr: true, displayName: true, preprocess: false },
    ],
  ],
}
