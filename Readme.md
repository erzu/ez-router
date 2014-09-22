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

### beforeFilter - 增加中间件

```js
var only = require('../middlewares/only')


function authenticate(req, res, next) {}

function findOne(req, res, next) {}


// routes/user.js
exports.beforeFilter = {
  '*': authenticate,
  'show edit': findOne
}
```

## Why Globals - 全局变量是怎么回事，你给我解释解释

在 [Proxy][proxy] 普及之前，用 JavaScript 实现 DSL 都不是一份好差事，很容易做着做着就变成类似 MongoDB 的 Query，或者 [model][model] 那种方式，灵活运用 this。但无论如何都没有 Ruby 里来的自然，对应到具体的 DSL，比如 Rails 项目里的 `config/routes.rb`，或者 capistrano、mina 要求的那份 `config/deploy.rb`，更别提 gemspec 文件。

不过，类似 mocha 这种，利用全局函数实现流畅代码编写的做法，却不失为一种好办法。我们可以把 [railstyle-router][railstyle-router] 中采用的 `app.namespace`、`this.member` 变成：

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

## References

- [model][model]
- [Proxy][proxy]
- [Rails Routing from the Outside In][rails-routing]
- [railstyle-router][railstyle-router]


[railstyle-router]: https://github.com/jsw0528/railstyle-router
[rails-routing]: http://guides.rubyonrails.org/routing.html
[rails-routes]: http://guides.rubyonrails.org/routing.html#crud-verbs-and-actions
[model]: https://github.com/geddy/model
[proxy]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
