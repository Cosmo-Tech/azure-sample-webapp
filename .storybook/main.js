import { dirname, resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: ['@storybook/preset-create-react-app', '@storybook/addon-docs', '@storybook/addon-onboarding'],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  docs: {
    autodocs: true,
  },

  staticDirs: ['../public'],

  webpackFinal: async (config) => {
    config.module.rules = config.module.rules.filter(
      (rule) => !(rule.use && rule.use.some((u) => u.loader?.includes('eslint')))
    );

    config.plugins = config.plugins.filter(
      (plugin) => !(plugin.constructor && plugin.constructor.name === 'ESLintWebpackPlugin')
    );

    config.resolve.fallback = {
      ...config.resolve.fallback,
      stream: resolvePath(__dirname, '../node_modules/stream-browserify'),
      process: resolvePath(__dirname, '../node_modules/process/browser'),
    };

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': '{}',
      })
    );

    return config;
  },
};

export default config;
