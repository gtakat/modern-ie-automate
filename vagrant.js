const exec = require("child_process").exec

exports = module.exports = {
  box_add: function(box, callback) {
    this.box_exists(box.boxname, (result) => {
      if (result === true) {
        callback(null)
        return
      } else {
        let command = `vagrant box add ${box.boxname} ${box.box_path}`
        exec(command, (error, stdout, stderr) => {
          if (stderr) {
            console.info(stderr)
          }
          if (error == null) {
            callback(null)
          } else {
            throw error
          }
        })
      }
    })
  },

  box_exists: function(boxname, callback) {
    let command = `vagrant box list | grep ${boxname}`
    exec(command, (error, stdout, stderr) => {
      if (error == null) {
        if (stdout == "") {
          callback(false)
        } else {
          callback(true)
        }
      } else {
        callback(false)
      }
    })
  },

  up: function(box, callback) {
    let option = {
      cwd: `./vagrant/${box.basename}`,
    }
    exec("vagrant up", option, (error, stdout, stderr) => {
      callback(null)
    })
  },
}
