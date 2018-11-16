var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*拦截*/
app.use(function(req,res,next){   // 进入路由之前优先进入function
  if(req.cookies.userId){  // 有cookies,说明已经登录
    next();
  }else{
    console.log(`path:${req.path},originalUrl:${req.originalUrl}`);
    // 结果例 => path:/goods/list,originalUrl:/goods/list?page=1&pageSize=8&sort=1&priceLevel=all
    if(req.originalUrl =='/users/login' || req.originalUrl == '/users/logout' || req.originalUrl.indexOf('/goods/list')>-1){  // 未登录时可以点击登录login登出logout和查看商品列表
      // if(req.originalUrl =='/users/login' || req.originalUrl == '/users/logout' || req.path == '/goods/list'){   // 第二种方法
      next();
    }else{
      res.json({
        status:'1001',
        msg:'当前未登录',
        result:''
      })
    }
  }
})


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
