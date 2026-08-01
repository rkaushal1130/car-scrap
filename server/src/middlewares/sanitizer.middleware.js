const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    // Strip HTML script tags & dangerous javascript attributes
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
      .replace(/javascript:[^\s'"]*/gi, '');
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === 'object') {
    const sanitizedObj = {};
    for (const key of Object.keys(value)) {
      // Prevent NoSQL Injection: Strip keys starting with $ or containing .
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }
      sanitizedObj[key] = sanitizeValue(value[key]);
    }
    return sanitizedObj;
  }

  return value;
};

const sanitizeRequest = (req, res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
};

module.exports = sanitizeRequest;
