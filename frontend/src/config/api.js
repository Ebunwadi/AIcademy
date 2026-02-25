const trimTrailingSlash = (url) => url.replace(/\/+$/, "");

const CORE_API_BASE = trimTrailingSlash(
  process.env.REACT_APP_CORE_API_URL || "http://localhost:5000"
);
const USER_API_BASE = trimTrailingSlash(
  process.env.REACT_APP_USER_API_URL || "http://localhost:5005"
);
const AI_API_BASE = trimTrailingSlash(
  process.env.REACT_APP_AI_API_URL || "http://localhost:5003"
);

export const API = {
  core: CORE_API_BASE,
  user: USER_API_BASE,
  ai: AI_API_BASE,
};
