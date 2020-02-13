module.exports.isAuthenticated = (req, res, next) => {
    if (!req.user) {
      res.status(401).json({msg:'Not Authenticated'})
    } else {
        next();      
    }
  }
