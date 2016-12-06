const vmlistLoader = require("./vmlist_loader")

exports = module.exports = {
  _list: [],

  init: function(callback) {
    vmlistLoader.get( (list) => {
      this._list = list
      callback(this)
    })
  },

  list: function() {
    return this._list
  },

  names: function() {
    return this.list().map( (element) => {
      return element.name
    })
  },

  get_by_name: function(name) {
    return this.list().filter( (element) => {
      return element.name == name
    }).pop()
  },
}
