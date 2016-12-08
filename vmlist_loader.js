const request = require("request")
const url = require("url")
const path = require("path")

exports = module.exports = {
  url: "https://developer.microsoft.com/en-us/microsoft-edge/api/tools/vms/",
  get: function(callback) {
    request
      .get({url: this.url, json: true}, function(error, response, body) {
        let list = []
        if (!error && response.statusCode == 200) {
          body.forEach(function(element) {
            element.software.forEach(function(environment) {
              if (environment.name == "Vagrant") {
                let item = null
                environment.files.filter(function(file) {
                  if (file.url.substr(-4) == ".zip") {
                    let parsedUrl = url.parse(file.url)
                    let filename = path.basename(parsedUrl.path)
                    let basename = path.basename(filename, ".zip")
                    item = {
                      name: element.name,
                      url: file.url,
                      parsed_url: parsedUrl,
                      filename: filename,
                      basename: basename,
                      boxname: path.basename(basename, ".Vagrant"),
                      box_path: `./boxes/${basename}.box`,
                    }
                  }
                })

                if (item) {
                  list.push(item)
                }
              }
            })
          })
        }
        callback(list)
      })
  },
}
