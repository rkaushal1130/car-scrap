const { mongoIdParamRule, paginationQueryRules } = require('./common.validator');

const mediaQueryValidator = [
  ...paginationQueryRules,
];

const mediaIdValidator = [
  mongoIdParamRule('id', 'Media Asset ID'),
];

module.exports = {
  mediaQueryValidator,
  mediaIdValidator,
};
