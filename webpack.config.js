const ingorednModulesList = [
  '@nestjs/websockets/socket-module',
  '@nestjs/microservices/microservices-module',
];

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['./src/main.ts'],
    externals: [],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          return ingorednModulesList.includes(resource);
        },
      }),
    ],
  };
};
