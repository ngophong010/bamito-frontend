import {v4 as uuidv4} from "uuid";
import unidecode from "unidecode";
import slugify from "slugify";

const generateShortCode = (name) => {
  if (!name) return "";
  const cleanedName = unidecode(name.replace(/[^a-zA-Z0-9]/g, "")).toUpperCase();
  const namePart = cleanedName.slice(0, 5);
  const uuidPart = uuidv4().slice(0, 5).toUpperCase();
  return `${namePart}${uuidPart}`;
};

const createSlug = (text) => {
    if (!text) return "";
    return slugify(text, {
        lower: true,
        locale: "vi",
    });
};

function formatISODate(isoString) {
  const date = new Date(isoString);
  const daysOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const dayOfWeek = daysOfWeek[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${dayOfWeek}, ${day}-${month}-${year}`;
}

export { generateShortCode, createSlug, formatISODate };