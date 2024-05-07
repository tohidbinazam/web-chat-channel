import Admin from '../models/Admin.js';
import Channel from '../models/Channel.js';
import Role from '../models/Role.js';

export const sendMessageMiddleware = async (slug, adminID) => {
  const admin = await Admin.findById(adminID).populate('role');

  const channel = await Channel.findOne({ slug });

  if (!channel || !channel.status) {
    return false;
  }

  const adminRole = admin.role;
  if (adminRole.slug == 'super-admin') return true;

  if (!admin || !admin.status || !admin.role.status) {
    return false;
  }

  const permissions = await Role.findById(adminRole._id).populate(
    'permissions'
  );

  const permissionCheck = permissions.permissions.find(
    (p) => p.slug === 'send-message' && p.status === true
  );

  if (!permissionCheck) {
    return false;
  }
  return true;
};
