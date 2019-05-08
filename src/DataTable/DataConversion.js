import replace from "lodash/replace";
import trim from "lodash/trim";
import _isDate from "lodash/isDate";
import isString from "lodash/isString";

const toBoolean = value => {
  if (!value) {
    return false;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return !!value;
  }
  return replace(trim(value.toLowerCase()), /[""'']/gi, "") === "true"
    ? true
    : false;
};

const isDate = value => {
  const regex = new RegExp(
    /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
  );
  return _isDate(value) || (isString(value) && regex.test(value));
};

export { toBoolean };
