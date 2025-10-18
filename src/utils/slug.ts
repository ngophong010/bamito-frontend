import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

/**
 * Creates a slug from a string, suitable for URLs.
 */
export const createSlug = (text: string): string => {
  if (!text) return "";
  return slugify(text, {
    lower: true,
    locale: "vi",
    remove: /[*+~.()'"!:@]/g,
  });
};

/**
 * Generates a unique, short business key from a name.
 * Example: 'Yonex Astrox' -> 'YONEX-A1B2C'
 */
export const generateBusinessKey = (name: string): string => {
  if (!name) return "";
  const base = slugify(name.split(" ")[0], {
    lower: false,
    locale: "vi",
    remove: /[^a-zA-Z0-9]/g,
  }).toUpperCase();
  const uuidPart = uuidv4().slice(0, 5).toUpperCase();
  return `${base.slice(0, 5)}-${uuidPart}`;
};
