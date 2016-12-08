const colors = require("colors/safe")

exports = module.exports = {
  info: function(debugInfo) {
    const message = colors.gray(`[DEBUG] ${debugInfo}`)
    console.info(message)
  },
}
