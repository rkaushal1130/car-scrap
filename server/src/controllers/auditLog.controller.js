const asyncHandler = require('../middlewares/asyncHandler.middleware');
const ApiResponse = require('../utils/ApiResponse.util');
const AuditLog = require('../models/AuditLog');

const getAllAuditLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.action) query.action = req.query.action;
  if (req.query.collectionName) query.collectionName = req.query.collectionName;

  const [logs, total] = await Promise.all([
    AuditLog.find(query).populate('performedBy', 'fullName email').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(200, { logs, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } }, 'Audit logs fetched successfully')
  );
});

module.exports = {
  getAllAuditLogs,
};
