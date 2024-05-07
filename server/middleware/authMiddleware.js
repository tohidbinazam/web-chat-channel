import { verifyToken } from '../utility/manageToken.js';
import Admin from '../models/Admin.js';
import expressAsyncHandler from 'express-async-handler';

const authCheck = (token, clearName) => {
  return expressAsyncHandler(async (req, res, next) => {
    if (!token) {
      res.status(401);
      throw new Error('You are not authorized');
    }
    // try {
    const decoded = verifyToken(token);

    const admin = await Admin.findById(decoded.id).populate('role');

    if (!admin || !admin.status || !admin.role.status) {
      // return res.clearCookie(clearName).status(401).send('You do not have access to this resource');
      res.clearCookie(clearName).status(401);
      throw new Error('You have no access to this resource');
    }

    req.data = decoded;
    req.admin = admin;
    next();
    // } catch (err) {
    //   res.clearCookie(clearName).status(401).send(err.message);
    // }
  });
};

// This middleware is used to check if the user is logged in or not
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  authCheck(token, 'token')(req, res, next);
};

// This middleware is used to check if the user has access to the single user or not
export const accessMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;
  authCheck(token, 'accessToken')(req, res, next);
};

export default authMiddleware;
