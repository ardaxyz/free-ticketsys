const c = require("ansi-colors");

const log = (
  message = "on top",
  type = "info",
  prefix = "github.com/ardaxyz"
) => {
  switch (type) {
    case "info":
      console.log(`${c.blueBright(prefix)} >> ${message}`);
      break;
    case "warn":
      console.log(`${c.yellow(prefix)} >> ${message}`);
      break;
    case "error":
      console.log(`${c.red(prefix)} >> ${message}`);
      break;
    case "success":
      console.log(`${c.green(prefix)} >> ${message}`);
      break;
  }
};

module.exports = { log };
