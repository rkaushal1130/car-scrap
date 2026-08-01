const User = require('../models/User');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new user account (Admin only)
 * @route   POST /api/v1/users
 * @access  Private/SuperAdmin
 */
const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role: role || 'SUPPORT_AGENT',
  });

  const createdUser = await User.findById(user._id).select('-refreshToken');

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User account created successfully'));
});

/**
 * @desc    Get all users with pagination, search, sorting & filtering
 * @route   GET /api/v1/users
 * @access  Private/SuperAdmin & OperationsManager
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const { search, role, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  // Build query pipeline
  const query = {};

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) {
    query.role = role;
  }

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const [users, total] = await Promise.all([
    User.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-refreshToken'),
    User.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      'Users retrieved successfully'
    )
  );
});

/**
 * @desc    Get single user details by ID
 * @route   GET /api/v1/users/:id
 * @access  Private/SuperAdmin & OperationsManager
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-refreshToken');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User details retrieved successfully'));
});

/**
 * @desc    Update user details (Admin only)
 * @route   PUT /api/v1/users/:id
 * @access  Private/SuperAdmin
 */
const updateUser = asyncHandler(async (req, res) => {
  const { fullName, email, role, isActive } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new ApiError(400, 'Email address is already in use');
    }
    user.email = email;
  }

  if (fullName) user.fullName = fullName;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  const updatedUser = await User.findById(user._id).select('-refreshToken');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, 'User updated successfully'));
});

/**
 * @desc    Delete / Deactivate user (SuperAdmin only)
 * @route   DELETE /api/v1/users/:id
 * @access  Private/SuperAdmin
 */
const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot delete your own account');
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'User account deleted successfully'));
});

/**
 * @desc    Update current authenticated user profile
 * @route   PATCH /api/v1/users/profile
 * @access  Private (Authenticated User)
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, avatarUrl } = req.body;

  const user = await User.findById(req.user._id);

  if (fullName) user.fullName = fullName;
  if (avatarUrl) user.avatarUrl = avatarUrl;

  await user.save();

  const updatedProfile = await User.findById(user._id).select('-refreshToken');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProfile, 'Profile updated successfully'));
});

/**
 * @desc    Change password for current authenticated user
 * @route   POST /api/v1/users/change-password
 * @access  Private (Authenticated User)
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const isPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, 'Invalid current password');
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password changed successfully'));
});

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
  changePassword,
};
