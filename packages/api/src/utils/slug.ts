/**
 * Generates a random 5-letter uppercase slug
 * e.g., "XKQPM", "ABCDE", etc.
 */
export function generateSlug(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let slug = "";
  for (let i = 0; i < 5; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}
