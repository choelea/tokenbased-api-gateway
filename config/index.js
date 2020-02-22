var fs = require('fs')
var LOG = require('../utils/logger')(__filename)
var path = require("path");


const config = {
  authenticateUrl: 'http://localhost:4001/authenticate',
  tokenName:'xtoken',
  tokenExpire: 86400, // expires in 24 hours
  // tokenExpire: 3600, // expires in 1 hours; this could be more reasonable when use mongodb and the token is rolling
  tokenStrategy:'mongo',//jwt, mongo
  tokenSecret: 'jiushu2020!!@#$$', // TODO it's better to read from disk instead of configure into source code in production
  resources:[
    {
      prefix:"/users", // Will be trimed when proxy to backend
      stripPrefix:false,
      endpoint:"http://localhost:4001",
      isAuthenticationNeeded:false,
    },
    {
      prefix:"/oapi",
      stripPrefix:true,
      endpoint:"http://localhost:4002",
      isAuthenticationNeeded:true,
    }
  ],
  mongo:{// only used when tokenStrategy=mongo
    url:'mongodb://localhost:27017',
    dbName:'apiproxy',
    options:{
      useUnifiedTopology:true
    }
  }
}

function loadConfig () {
  // eslint-disable-next-line no-undef
  const sdkConfigPath = path.resolve(__dirname,'../../apiproxy-config/tokenbased-api-gateway.json',);
  try {
    const stats = fs.statSync(sdkConfigPath)

    if (!stats.isFile()) {
      LOG.warn(`${sdkConfigPath} 不存在，将使用 config.js 中的配置`)
      return {}
    }
  } catch (e) {
    LOG.warn('cannot find the give file:' + sdkConfigPath)
    return {}
  }
  // 返回配置信息
  try {
    const content = fs.readFileSync(sdkConfigPath, 'utf8')
    return JSON.parse(content)
  } catch (e) {
    // 如果配置读取错误或者 JSON 解析错误，则输出空配置项
    LOG.error(`${sdkConfigPath} 解析错误，不是 JSON 字符串`)
    return {}
  }
}
// Exports
module.exports = Object.assign(config, loadConfig());
