/**
 * Utility functions for slug generation and uniqueness
 */

/**
 * Converts a string into a URL-friendly slug
 * @param text The string to slugify
 * @returns A slugified string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // Remove all non-word chars except spaces and hyphens
    .replace(/[\s_-]+/g, '-')     // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');     // Trim leading/trailing hyphens
}

/**
 * Generates a unique slug for a given mongoose model
 * @param model The Mongoose model to check against
 * @param name The source string for the slug
 * @param excludeId Optional ID to exclude from search (for updates)
 * @returns A unique slug string
 */
export async function generateUniqueSlug(
  model: any,
  name: string,
  excludeId?: any
): Promise<string> {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  // If base slug is empty (e.g. only special characters), provide a default
  if (!slug) {
    slug = 'item';
  }

  while (true) {
    const query: any = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await model.findOne(query).select('_id').lean();
    if (!existing) {
      return slug;
    }
    
    slug = `${baseSlug || 'item'}-${counter}`;
    counter++;
    
    // Safety break
    if (counter > 100) {
      throw new Error('Could not generate a unique slug after 100 attempts');
    }
  }
}
