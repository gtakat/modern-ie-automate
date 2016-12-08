const ProgressBar = require("progress")
const request = require("request")
const fs = require("fs")
const debug = require("./debug")

exports = module.exports = {
  get: function(box, callback) {
    const tmpFile = `./tmp/${box.filename}`

    if (fs.existsSync(box.box_path)) {
      callback(tmpFile)
      return
    }

    const fileStream = fs.createWriteStream(tmpFile)

    debug.info(box.url)

    fileStream.on("open", function(fd) {
      request
        .get(box.url, {timeout: 3000})
        .on("error", function(err) {
          console.log(err)
        })
        .on("response", function(response) {
          debug.info(`status code: ${response.statusCode}`)
          debug.info(`Content-Type: ${response.headers["content-type"]}`)

          const totalLength = response.headers["content-length"]
          debug.info(`Content-Length: ${totalLength} bytes`)

          let progressInfo =
            "  downloading [:bar] :current / :total (:percent) :etas"
          const progressBar = new ProgressBar(progressInfo, {
            complete: "=",
            incomplete: " ",
            width: 30,
            total: parseInt(totalLength),
          })

          response
            .on("data", function(chunk) {
              fileStream.write(chunk)
              progressBar.tick(chunk.length)
            })
            .on("end", function() {
              fileStream.end()
              callback(tmpFile)
            })
        })
    })
  },
}
