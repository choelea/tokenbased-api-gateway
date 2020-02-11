module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'apiGateway',
      script: 'bin/www.js',
      instances: 0,
      exec_mode: 'cluster',
      env: {
        // PORT: 4011,
        LOGLEVEL: 'info',
      },
      env_dev: {
        // PORT: 4011,
        NODE_ENV: 'dev',
      },
      env_int: {
        // PORT: 4011,
        NODE_ENV: 'int',
      },
      env_pre: {
        // PORT: 4011,
        NODE_ENV: 'pre',
      },
      env_prd: {
        // PORT: 4011,
        NODE_ENV: 'prd',
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  // deploy: {
  //   dev: {
  //     user: 'okchem',
  //     host: '192.168.1.97',
  //     ref: 'origin/master',
  //     repo: 'git@bitbucket.org:lightyearcq/okchem-new-chicago.git',
  //     path: '/home/okchem/nodejsapps/iq-web',
  //     'post-deploy': 'npm install && npm run gulp && pm2 reload ecosystem.config.js --env dev',
  //   },
  // },
}
