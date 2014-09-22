'use strict';

var app = require('./fixture/app')
var router = require('..')
var expect = require('expect.js')
var path = require('path')


function findRoute(method, path) {
  var routes = app.routes[method]

  for (var i = 0, len = routes.length; i < len; i++) {
    var route = routes[i]
    if (route.path.indexOf(path) === 0) return route
  }
}

/* globals resources: false, namespace: false */
describe('router', function() {

  before(function() {
    router(app, {
      routes: path.join(__dirname, 'fixture', 'routes')
    }, function() {
      resources('posts')
      namespace('admin', function() {
        resources('posts')
        resources('users')
      })
    })
  })

  it('should not leak globals', function() {
    expect(global.namespace).to.be(undefined)
    expect(global.resources).to.be(undefined)
    expect(global.member).to.be(undefined)
    expect(global.collection).to.be(undefined)
  })

  it('should register posts restful handlers', function() {
    expect(findRoute('get', '/posts').callbacks).to.not.be.empty()
  })

  it('should prepend filters', function() {
    expect(findRoute('get', '/admin/posts').callbacks.length).to.be(2)
    expect(findRoute('get', '/admin/posts/:id').callbacks.length).to.be(3)
    expect(findRoute('get', '/admin/users').callbacks.length).to.be(2)
  })

})
