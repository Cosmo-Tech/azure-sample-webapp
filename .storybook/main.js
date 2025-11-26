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
    // 🚫 Remove any ESLint loaders injected by CRA preset
    config.module.rules = config.module.rules.filter(
      (rule) => !(rule.use && rule.use.some((u) => u.loader?.includes('eslint')))
    );

    // 🚫 Remove ESLint plugin created by CRA (this is the real problem)
    config.plugins = config.plugins.filter(
      (plugin) => !(plugin.constructor && plugin.constructor.name === 'ESLintWebpackPlugin')
    );

    return config;
  },
};

export default config;
