const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

/**
 * Generate a unique slug for a given Mongoose model
 */
const generateUniqueSlug = async (Model, text, currentId = null) => {
  const baseSlug = slugify(text) || 'item';
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query = { slug };
    if (currentId) {
      query._id = { $ne: currentId };
    }
    const existing = await Model.findOne(query).select('_id').lean();
    if (!existing) {
      return slug;
    }
    slug = `${baseSlug}-${count}`;
    count += 1;
  }
};

/**
 * Calculate reading time in minutes for text content
 */
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const cleanContent = content.replace(/<[^>]*>/g, '');
  const wordCount = cleanContent.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

module.exports = {
  slugify,
  generateUniqueSlug,
  calculateReadingTime,
};
