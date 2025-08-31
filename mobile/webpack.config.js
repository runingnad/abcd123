const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // redirect react-native-paper’s bad require to Expo’s icons
  config.resolve.alias['@react-native-vector-icons/material-design-icons'] =
    '@expo/vector-icons/MaterialCommunityIcons';

  return config;
};
