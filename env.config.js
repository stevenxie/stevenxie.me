/**
 * Set an environment variable, if it was not already set.
 *
 * @param {String} key
 * @param {String} val
 */
function setenv(key, val) {
  const current = process.env[key];
  if (!current) process.env[key] = val;
}

setenv("BASE_URL", "/");
switch (process.env.NODE_ENV) {
  case "development":
    setenv("API_URL", "http://localhost:3000");
    break;

  default:
    setenv("API_URL", "https://api.stevenxie.me");
}
