const User = require('../models/User');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler.middleware');

const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { fullName: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { users, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } },
      'Users fetched successfully'
    )
  );
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return res.status(200).json(new ApiResponse(200, user, 'User details retrieved'));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, avatarUrl } = req.body;
  const user = await User.findById(req.user._id);

  if (fullName) user.fullName = fullName;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

  await user.save();

  return res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, 'Invalid current password');
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, 'Password changed successfully'));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res.status(200).json(new ApiResponse(200, user, 'User role updated successfully'));
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUserProfile,
  changePassword,
  updateUserRole,
};
