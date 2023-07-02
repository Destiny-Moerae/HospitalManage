/* eslint valid-jsdoc: "off" */

'use strict'
const userConfig = require('./config.user')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1688176906909_442'

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  config.security = {
    csrf: false,
  }

  config.jwt = {
    secret: userConfig.jwtSecret,
  }

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/hospital',
      options: {},
    },
  }

  return {
    ...config,
    ...userConfig,
  }
}
