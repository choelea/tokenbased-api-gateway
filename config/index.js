var fs = require('fs')
const config = {
  authenticateUrl: 'http://localhost:4001/authenticate',
  // tokenExpire: 86400, // expires in 24 hours
  tokenExpire: 3600, // expires in 1 hours; this could be more reasonable when use mongodb and the token is rolling
  tokenStrategy:'jwt',//jwt, mongo
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
    dbName:'apiproxy'
  }
}

function loadConfig () {
  // const sdkConfigPath = '/usr/config/tokenbased-api-gateway.json';
  const sdkConfigPath = '/Users/joe/tmp/tokenbased-api-gateway.json';
  try {
    const stats = fs.statSync(sdkConfigPath)

    if (!stats.isFile()) {
      console.log(`${sdkConfigPath} 不存在，将使用 config.js 中的配置`)
      return {}
    }
  } catch (e) {
    console.log('cannot find the give file:' + sdkConfigPath)
    return {}
  }
  // 返回配置信息
  try {
    const content = fs.readFileSync(sdkConfigPath, 'utf8')
    return JSON.parse(content)
  } catch (e) {
    // 如果配置读取错误或者 JSON 解析错误，则输出空配置项
    console.log(`${sdkConfigPath} 解析错误，不是 JSON 字符串`)
    return {}
  }
}
// Exports
module.exports = Object.assign(config, loadConfig());
