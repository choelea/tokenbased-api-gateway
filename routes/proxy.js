const express = require('express')
/* eslint-disable new-cap */
const router = express.Router()
/* eslint-enable new-cap */
const proxy = require('express-http-proxy')
const config = require('../config/index')
const { isLoginBuyer } = require('../middlewares/authenticator')
/* eslint-disable no-param-reassign,dot-notation */
const myProxy = proxy(config.resourceServer, {
  memoizeHost: false,
  proxyReqPathResolver: (req) => {
    const path = req.originalUrl
    return path.replace('/api', '')
  },
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    // you can update headers
    proxyReqOpts.headers['chembnb_user_id'] = srcReq.user ? `${srcReq.user.accountId}` : ''
    return proxyReqOpts
  },
})
/* eslint-enable no-param-reassign,dot-notation */
//  proxy request directly to back-end service.
//  Eg: URL (/api/group-buying/search) from client
//  will map '/group-buying/search' in proxy
router.get('/group-buying/application-list/:viewSize/:viewIndex', isLoginBuyer ,myProxy)
router.get('/group-buying/search', myProxy)
module.exports = router
