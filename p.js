const colors = require("colors/safe")
const printf = require("printf")

exports = module.exports = {
  start_format: "%-15s",

  start: function(message) {
    process.stdout.write(printf(this.start_format, message))
  },

  finish: function(result) {
    const message = result ? colors.green("[ OK ]") : colors.red("[ NG ]")
    console.info(message)
  },
}
