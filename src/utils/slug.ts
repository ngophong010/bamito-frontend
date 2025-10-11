import { v4 as uuidv4 } from "uuid";
import unidecode from "unidecode";
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
  const cleanedName = unidecode(name.split(' ')[0]).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const uuidPart = uuidv4().slice(0, 5).toUpperCase();
  return `${cleanedName.slice(0, 5)}-${uuidPart}`;
};
