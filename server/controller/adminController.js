import asyncHandler from 'express-async-handler';
import Admin from '../models/Admin.js';
import sendEmail from '../utility/sendEmail.js';
import bcrypt from 'bcryptjs';

// Admin create controller
export const createAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const findAdmin = await Admin.findOne({ email });
  if (findAdmin) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  const newAdmin = await Admin.create({ ...req.body });
  const admin = await Admin.findById(newAdmin._id)
    .populate('role')
    .select('-password');

  sendEmail(
    email,
    'Account created successfully',
    `Email: ${email},
     Password: ${req.body.password}
     Role: ${admin.role.name}`
  );

  res.status(201).json({ message: 'Admin created successfully', admin });
});

// Get all admins controller
export const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find()
    .populate('role')
    .select('-password')
    .sort({ createdAt: -1 });
  res.status(200).json(admins);
});

// Get admin by id controller
export const getAdminById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const admin = await Admin.findById(id);
  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }

  res.status(200).json({ admin });
});

// Delete admin by id controller
export const deleteAdminById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const admin = await Admin.findByIdAndDelete(id);
  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }

  res.status(200).json({ message: 'Admin deleted successfully', admin });
});

// Update admin by id controller
export const updateAdminById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // if req.body contain password then hash it
  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
  }

  const admin = await Admin.findByIdAndUpdate(id, req.body, { new: true })
    .populate('role')
    .select('-password');
  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }
  res.status(200).json({ message: 'Admin updated successfully', admin });
});
