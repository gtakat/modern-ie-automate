const async = require("async")
const inquirer = require("inquirer")
const downloader = require("./downloader")
const boxes = require("./boxes")
const unzip = require("./unzip")
const vagrant = require("./vagrant")
const p = require("./p")
const debug = require("./debug")

async.waterfall([
  // TODO system check
  (callback) => {
    p.start("system check")
    p.finish(true)
    callback(null)
  },

  // get vmlist
  (callback) => {
    p.start("getting vmlist")
    boxes.init(function(boxes) {
      p.finish(true)
      callback(null, boxes)
    })
  },

  // select vm
  (boxes, callback) => {
    inquirer.prompt([
      {
        type: "list",
        name: "box",
        message: "Choice you need browser version!",
        choices: boxes.names(),
        filter: (val) => {
          return boxes.get_by_name(val)
        },
      },
    ]).then(function(answers) {
      callback(null, answers.box)
    })
  },

  // download image
  (box, callback) => {
    downloader.get(box, (filePath) => {
      debug.info(`download file path: ${filePath}`)
      callback(null, box, filePath)
    })
  },

  // unzip
  (box, filePath, callback) => {
    debug.info(`unzip ${filePath}`)
    p.start("unzip box file...")
    unzip.unzip_to_path(filePath, box.box_path, () => {
      p.finish(true)
      callback(null, box)
    })
  },

  // box setup
  (box, callback) => {
    debug.info("vagrant box add")
    vagrant.box_add(box, () => {
      callback(null, box)
    })
  },

  // vagrant setup
  (box, callback) => {
    debug.info("vagrant setup")
    callback(null, box)
  },

  // vagrant up
  (box, callback) => {
    debug.info("vagrant up")
    vagrant.up(box, () => {
      callback(null)
    })
  },
], (err, results) => {
  if (err) {
    throw err
  }
  console.log("finish!")
})
