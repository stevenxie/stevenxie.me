const setenv = (key, val) => (process.env[key] = val);

setenv("BASE_URL", "/");
switch (process.env.NODE_ENV) {
  case "development":
    setenv("API_URL", "http://localhost:3000");
    break;

  default:
    setenv("API_URL", "https://api.stevenxie.me");
}
