import Constants from 'expo-constants';
import { Platform } from 'react-native';

const { manifest } = Constants;
const prodUrl = 'http://uptraceapi-env.eba-qtswbmmy.ap-southeast-1.elasticbeanstalk.com';

const ENV = {
  dev: {
    apiUrl: `http://${manifest.debuggerHost.split(':').shift()}:3000`,
    amplitudeApiKey: null,
  },
  staging: {
    apiUrl: prodUrl,
    amplitudeApiKey: null,
  },
  prod: {
    apiUrl: prodUrl,
    amplitudeApiKey: null,
  },
};

const getEnvVars = (env = manifest.releaseChannel) => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.
  if (__DEV__) {
    return ENV.dev;
  } else if (env === 'staging') {
    return ENV.staging;
  } else if (env === 'prod') {
    return ENV.prod;
  }
};

export default getEnvVars;