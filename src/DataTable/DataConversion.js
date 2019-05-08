import replace from "lodash/replace";
import trim from "lodash/trim";

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

export { toBoolean };
