const jwt = require('jsonwebtoken');

const maxAge = 24 * 60 * 60;

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

const checkToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')?.[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({
          errorCode: 401,
          message: 'Unauthorized',
        });
      } else {
        // No need to check manually whether token is expired
        // jwt.verify will give error if token is expired
        // if (Date.now() >= decodedToken.exp * 1000) {
        // }
        req.userId = decodedToken._id;
        next();
      }
    });
  } else {
    res.status(401).json({
      errorCode: 401,
      message: 'Unauthorized',
    });
  }
};

module.exports = {
  maxAge,
  createToken,
  checkToken,
};
