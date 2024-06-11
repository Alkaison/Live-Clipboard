/**
 * Sanitize a string by removing invalid characters and file extensions.
 * Allowed characters: letters (a-z, A-Z), numbers (0-9), and hyphens (-).
 *
 * @param {string} str - The input string to be sanitized.
 * @returns {string} - The sanitized string, or an "unknown" string if the input is invalid.
 */
export function sanitizeString(str) {
  if (typeof str !== "string") {
    return ""; // Return empty if input is not a string
  }

  // Check if the string has a file extension by looking for a '.' followed by at least one character
  const hasFileExtension =
    str.lastIndexOf(".") > 0 && str.lastIndexOf(".") < str.length - 1;

  let baseName = str;

  if (hasFileExtension) {
    // Remove the file extension if it exists
    baseName = str.substring(0, str.lastIndexOf("."));
  }

  // Remove invalid characters
  let sanitized = baseName.replace(/[^a-zA-Z0-9-]/g, "");

  // Return sanitized string or an empty string if nothing is left
  return sanitized || "unknown";
}
