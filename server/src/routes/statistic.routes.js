const express = require('express');
const router = express.Router();

const {
  getAllStatistics,
  getStatisticById,
  createStatistic,
  updateStatistic,
  deleteStatistic,
} = require('../controllers/statistic.controller');

const {
  createStatisticValidator,
  updateStatisticValidator,
  getStatisticsQueryValidator,
  statisticIdValidator,
} = require('../validators/statistic.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, optionalJWT, authorizeRoles } = require('../middlewares/auth.middleware');

router.get('/', optionalJWT, getStatisticsQueryValidator, validate, getAllStatistics);
router.get('/:id', optionalJWT, statisticIdValidator, validate, getStatisticById);

router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER'));

router.post('/', createStatisticValidator, validate, createStatistic);
router.put('/:id', updateStatisticValidator, validate, updateStatistic);
router.delete('/:id', statisticIdValidator, validate, deleteStatistic);

module.exports = router;
