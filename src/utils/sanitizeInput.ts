/**
 * Input Safety and Sanitization Utility for Denlight IT Solutions
 * Ensures user input is safe against XSS, HTML injection, control chars, and malicious payloads.
 */

/**
 * Sanitizes user search input string.
 * Removes HTML tags, script protocols, unsafe control characters,
 * caps length to 100 characters, and trims whitespace.
 */
export function sanitizeSearchInput(input: string): string {
  if (typeof input !== 'string') return '';

  // Cap length to 100 chars to avoid performance degradation or ReDoS
  let clean = input.slice(0, 100);

  // Remove potential script tags, iframe tags, and event handler patterns
  clean = clean.replace(/<[^>]*>?/gm, ''); // Strips HTML tags
  clean = clean.replace(/javascript\s*:/gi, ''); // Strips javascript: protocol
  clean = clean.replace(/data\s*:/gi, ''); // Strips data: protocol
  clean = clean.replace(/vbscript\s*:/gi, ''); // Strips vbscript: protocol
  clean = clean.replace(/on\w+\s*=/gi, ''); // Strips inline event handlers like onerror=

  // Strip control characters & non-printable ASCII except standard spaces/punctuation
  clean = clean.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

  // Trim leading & trailing whitespace and normalize spaces
  clean = clean.replace(/\s+/g, ' ').trim();

  return clean;
}

/**
 * Tokenizes and matches a product against sanitized multi-word search queries.
 * Every word in the query must match at least one attribute of the product.
 */
export function matchProductWithSearch(product: any, rawQuery: string): boolean {
  const sanitized = sanitizeSearchInput(rawQuery);
  if (!sanitized) return true;

  // Split query into individual words/tokens for multi-attribute matching
  const tokens = sanitized.toLowerCase().split(' ').filter(Boolean);
  if (tokens.length === 0) return true;

  // Prepare product searchable string matrix
  const name = (product.name || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const category = (product.category || '').toLowerCase();
  const description = (product.description || '').toLowerCase();
  const laptopCondition = (product.laptopCondition || '').toLowerCase();
  const priceStr = String(product.priceKes || '');
  const depositStr = String(product.financing?.depositKes || '');
  const partnersStr = Array.isArray(product.availablePartners) ? product.availablePartners.join(' ').toLowerCase() : '';
  const badgeText = (product.badgeText || '').toLowerCase();
  
  // Collect all spec values
  const specsValues = product.specs ? Object.values(product.specs).join(' ').toLowerCase() : '';

  const searchableBlob = `${name} ${brand} ${category} ${description} ${laptopCondition} ${priceStr} ${depositStr} ${partnersStr} ${badgeText} ${specsValues}`;

  // Every query token must exist somewhere inside the product searchable blob
  return tokens.every((token) => searchableBlob.includes(token));
}
