import xSlug from "slugify";

export const slugify = (text: string) => {
  return xSlug(text).toLowerCase();
};
