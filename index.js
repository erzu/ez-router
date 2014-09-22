'use strict';

var path = require('path')
var _ = require('@ali/belt')


module.exports = function(router, opts, fn) {
  if (typeof opts == 'function') {
    fn = opts
    opts = { routes: './routes' }
  }

  var _scopes = []
  var _collections
  var _members

  function _require(name) {
    var args = [process.cwd(), opts.routes].concat(_scopes)

    args.push(_.singularize(name))

    var fpath = path.resolve.apply(path, args)
    var rpath = path.relative(__dirname, fpath)

    if (rpath[0] != '.') rpath = './' + rpath

    return require(rpath)
  }

  function namespace(scope, fn) {
    _scopes.push(scope)
    fn()
    _scopes.pop()
  }

  function resources(resource, fn) {
    var route = _require(resource)

    _collections = [
      ['get', '/', 'list'],
      ['get', '/new', 'new'],
      ['post', '/', 'create']
    ]

    _members = [
      ['get', '/:id', 'show'],
      ['get', '/:id/edit', 'edit'],
      ['patch', '/:id', 'update'],
      ['delete', '/:id', 'delete']
    ]

    if (fn) fn()

    var filters = route.beforeFilter

    function wire(verb, mpath, handler) {
      var args = [mpath]

      if (!(handler in route)) return

      if (filters) {
        for (var cases in filters) {
          if (cases == '*' ||
              cases.split(' ').indexOf(handler) >= 0) {
            args = args.concat(filters[cases])
          }
        }
      }

      args.push(route[handler])
      router[verb].apply(router, args)
    }

    function iterate(entry) {
      var verb = entry[0]
      var mpath = entry[1]
      var handler = entry[2]
      var parts = _scopes.concat(resource)

      if (mpath != '/') parts.push(mpath.slice(1))

      wire(verb, '/' + parts.join('/') + '.:format?', handler)
    }

    _collections.forEach(iterate)
    _members.forEach(iterate)

    _collections = null
    _members = null
  }

  function member(verb, handlers) {
    handlers.split(' ').forEach(function(handler) {
      _members.push([verb, '/:id/' + handler, handler])
    })
  }

  function collection(verb, handlers) {
    handlers.split(' ').forEach(function(handler) {
      _collections.push([verb, '/' + handler, handler])
    })
  }


  var globalWas = {}
  var globals = ['namespace', 'resources', 'member', 'collection']

  globals.forEach(function(g) {
    if (typeof global[g] != 'undefined')
      globalWas[g] = global[g]
  })

  global.namespace = namespace
  global.resources = resources
  global.member = member
  global.collection = collection

  fn(router)

  globals.forEach(function(g) {
    delete global[g]
    if (g in globalWas) global[g] = globalWas[g]
  })
}
