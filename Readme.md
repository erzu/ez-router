# Router

Rails 风格的路由。


## Routes - 默认配置的路由

参考 [Rails Routes][rails-routes] 说明：

| HTTP Verb | Path             | Controller#Action | Used for                                     |
|-----------|------------------|-------------------|----------------------------------------------|
| GET       | /photos          | photos#index      | display a list of all photos                 |
| GET       | /photos/new      | photos#new        | return an HTML form for creating a new photo |
| POST      | /photos          | photos#create     | create a new photo                           |
| GET       | /photos/:id      | photos#show       | display a specific photo                     |
| GET       | /photos/:id/edit | photos#edit       | return an HTML form for editing a photo      |
| PATCH     | /photos/:id      | photos#update     | update a specific photo                      |
| DELETE    | /photos/:id      | photos#destroy    | delete a specific photo                      |


## Usage - 使用说明

### Express - 在 Express 中配置

在 app.js 中：

```js
var router = require('ez-router')
var homepage = require('./routes/homepage')


router(app, function(app) {
  namespace('admin', function() {
    resources('creations')
  })

  resources('users')

  app.get('/about', homapage.about)
})
```

默认情况下，ez-router 会去当前进程目录 `process.cwd()` 的 `routes` 目录下找对应的模块。
例如，上述代码示例中，将会加载：

    ./routes/admin/creation.js
    ./routes/user.js

注意模块名就变成单数。

模块中暴露出来的方法，将根据 Rails Routes 规范映射起来，如果没找到对应规则上的方法，就不会
绑定对应的路由。


### beforeFilter - 增加中间件

```js
function authenticate(req, res, next) {
  if (req.user) {
    next()
  } else {
    next(new Error('Forbidden'))
  }
}

function findOne(req, res, next) {}


/*
 * GET /users/:id
 */
exports.show = function(req, res, next) {
  // implementation detail
}


/*
 * GET /users/:id/edit
 */
exports.edit = function(req, res, next) {
  // implementation detail
}


/*
 * PATCH /users/:id
 */
exports.update = function(req, res, next) {
  // implementation detail
}


// routes/user.js
exports.beforeFilter = {
  '*': authenticate,
  'show edit': findOne
}
```

展开来就是：

```js
app.get('/users/:id', authenticate, findOne, exports.show)
app.get('/users/:id/edit', authenticate, findOne, exports.edit)
app.patch('/users/:id', authenticate, exports.update)
```


## Why Globals - 全局变量是什么鬼

用 JavaScript 实现 DSL 都不是一份好差事，很容易做着做着就变成类似 MongoDB 的 Query，
或者 [model][model] 那种方式，灵活运用 this。

很难做得像 Ruby 里那样自然，对应到具体的 DSL，比如 Rails 项目里的 `config/routes.rb`，
或者 capistrano、mina 要求的那份 `config/deploy.rb`，更别提 gemspec 文件。

不过，类似 mocha 这种，利用全局函数实现流畅代码编写的做法，却不失为一种好办法。我们可以把
[railstyle-router][railstyle-router] 中采用的 `app.namespace`、`this.member` 变成：

```js
namespace('admin', function() {
  resources('creations', function() {
    member('post', 'launch')
  })
})
```

这和 Rails 的写法还是比较相近的：

```ruby
namespace :admin do
  resources :creations do
    member do
      post :launch
    end
  end
end
```

使用 ez-router 的时候，在回调函数执行完毕后，将会清除这些全局函数：

```js
var router = require('ez-router')

router(app, function(app) {
  namespace('admin', function() {
    resources('creations')
  })

  resources('users')
})

console.log(typeof namespace)     // 'undefined'
console.log(typeof resources)     // 'undefined'
```


## References

- [model][model]
- [Rails Routing from the Outside In][rails-routing]
- [railstyle-router][railstyle-router]


[railstyle-router]: https://github.com/jsw0528/railstyle-router
[rails-routing]: http://guides.rubyonrails.org/routing.html
[rails-routes]: http://guides.rubyonrails.org/routing.html#crud-verbs-and-actions
[model]: https://github.com/geddy/model
