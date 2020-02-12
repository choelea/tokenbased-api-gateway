module.exports.isAuthenticated = (req, res, next) => {
    if (!req.user) {
      res.status(401).json({msg:'Not Authenticated'})
    } else {
        if (req.user.userRole==='BUYER'){
            next()
        }else{
            res.status(403).json({msg:'Not Authorized'})
        }
      
    }
  }
