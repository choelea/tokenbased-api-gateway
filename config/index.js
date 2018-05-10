const dev = require('./deployment/dev')
const int = require('./deployment/int')
const pre = require('./deployment/pre')
const prd = require('./deployment/prd')
const env = {
  dev,
  int,
  pre,
  prd,
}
// TODO: ensure the NODE_ENV must equal to short name defined above
const activeEnv = env[process.env.NODE_ENV || 'dev']
const config = {
  resourceServer: activeEnv.resourceServer,
  tokenSecret: 'jiushu2018!!@#$$', // TODO it's better to read from disk instead of configure into source code in production
}

module.exports = config
