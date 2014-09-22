# Router

Rails 风格的路由。

## Usage

在 app.js 中：

```js
var router = require('@ali/router')
var homepage = require('./routes/homepage')


router(app, function(app) {
  namespace('admin', function() {
    resources('creations')
    resources('templets')
  })

  resources('templets')
  resources('users')

  app.get('/about', homapage.about)
})
```

在路由处理器中：

```js
var only = require('../middlewares/only')


// routes/user.js
exports.beforeFilter = {
  '*': authenticate,
  'show edit': findOne
}

exports.list = function(req, res, next) {
  // GET /users
}

exports.show = function(req, res, next) {
  // GET /users/:id
}
```
