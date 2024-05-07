import expressAsyncHandler from 'express-async-handler';
import Role from '../models/Role.js';

const permissionMiddleware = (operation) => {
  return expressAsyncHandler(async (req, res, next) => {
    // try {
    const adminRole = req.admin.role;

    if (adminRole.slug == 'super-admin') return next();
    const permissions = await Role.findById(adminRole._id).populate(
      'permissions'
    );
    const permissionCheck = permissions.permissions.find(
      (p) => p.slug === operation && p.status === true
    );

    if (!permissionCheck) {
      // return res.status(401).send('You do not have access to this resources');
      res.status(401);
      throw new Error('You have no access to this resource');
    }
    next();
    // } catch (err) {
    //   res.status(500).send(err.message);
    // }
  });
};

export default permissionMiddleware;
