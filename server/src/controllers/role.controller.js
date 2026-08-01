const asyncHandler = require('../middlewares/asyncHandler.middleware');
const ApiResponse = require('../utils/ApiResponse.util');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

const getAllRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find({ isDeleted: false }).populate('permissions').sort({ name: 1 }).lean();
  return res.status(200).json(new ApiResponse(200, roles, 'Roles fetched successfully'));
});

const getAllPermissions = asyncHandler(async (req, res) => {
  const permissions = await Permission.find({ isDeleted: false }).sort({ module: 1, name: 1 }).lean();
  return res.status(200).json(new ApiResponse(200, permissions, 'Permissions fetched successfully'));
});

module.exports = {
  getAllRoles,
  getAllPermissions,
};
