import { verifyToken } from '../../utility/manageToken.js';
import User from '../../model/userModel.js';

const authCheck = (token) => {
  return async (req, res, next) => {
    try {
      const decode = verifyToken(token);
      const user = await User.findById(decode.id).select('-password');

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: 'User not found!' });
      }

      if (user.token !== token || !user.status) {
        return res.status(401).json({
          success: false,
          message:
            user.token !== token
              ? 'Unauthorized access!'
              : 'Account is currently disabled. Please contact support.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        return res.status(401).json({ success: false, message: error.message });
      }

      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  };
};

// This middleware is used to check if the user is logged in or not
const authAPPMiddleware = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    authCheck(token, 'token')(req, res, next);
  } else {
    res.json({ success: false, message: 'unauthorized access!' });
  }
};

// This middleware is used to check if the user has access to the single user or not
export const accessMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;
  authCheck(token, 'accessToken')(req, res, next);
};

export default authAPPMiddleware;
