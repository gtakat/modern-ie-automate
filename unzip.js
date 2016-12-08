// unzip 64bit zip file
// ex) zip -p zipfile > file

const exec = require("child_process").exec
const fs = require("fs")

exports = module.exports = {
  unzip_to_path: function(filePath, dest, callback) {
    if (filePath && dest) {
      if (fs.existsSync(dest)) {
        callback()
        return
      }

      let command = `/usr/bin/unzip -p ${filePath} > ${dest}`
      exec(command, (error, stdout, stderr) => {
        if (error == null) {
          fs.unlink(filePath, (err) => {
            if (err) {
              throw err
            }
            callback()
          })
        }
        if (stdout) {
          console.log("stdout: " + stdout)
        }
        if (stderr) {
          console.log("stderr: " + stderr)
        }
        if (error !== null) {
          console.log("Exec error: " + error)
        }
      })
    }
  },
}
