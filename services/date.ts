
const isValidDate = (date) => date instanceof Date && !isNaN(date);
const getOnlyValidDate = (date) => (isValidDate(date) ? date : new Date());

// Convert a Date object into YYYY-MM-DD
const dateToISO = (date) =>
  getOnlyValidDate(date).toISOString().substring(0, 10);

/**
 * Extract only the time from a date.
 * Date can be a string or a Date.
 * Return result in timestamp seconds.
 */
const extractTime = (date) => {
  if (typeof date === "string") {
    date = Date.parse(date);
  }
  if (!isValidDate) {
    throw Error("The date is not valid.")
  }
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}


/**
 * Extract only the day from a date.
 * Return result in timestamp seconds.
 */
const extractDay = (date) => {
  if (typeof date === "string") {
    date = Date.parse(date);
  }
  if (!isValidDate) {
    throw Error("The date is not valid.")
  }
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}
