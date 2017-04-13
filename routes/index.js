var express = require('express');
var router = express.Router();


//加载生成MD5值依赖模块
         var crypto = require('crypto');// 加密和解密模块
         var User = require('../models/user');
var Post = require("../models/post.js");//加载用户发表微博模块

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { title: '主页' });
  //读取所有的用户微博，传递把posts微博数据集传给首页
  Post.get(null,function(err,posts){
	  if(err){
		  posts = [];
	  }
	  //调用模板引擎，并传递参数给模板引擎
	  res.render('index',{title:'首页',posts:posts});
  })
});

// 用户注册
router.get('/reg', checkNotLogin);//页面权限控制，注册功能只对未登录用户可用

router.get('/reg', function(req, res) { 
	res.render('reg', {title: '用户注册', });
});

// 用户页面的功能是显示该用户发表的所有微博信息
router.get('/u/:user',function(req,res){
	User.get(req.params.user,function(err,user){
		//判断用户是否存在
		if(!user){
			req.flash('error','用户不存在');
			return res.redirect('/');
		}
		//调用对象的方法用户存在，从数据库获取该用户的微博信息
		Post.get(user.name,function(err,posts){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			//调用user模板引擎，并发送数据（用户名和微博集合）
			res.render('user',{
				title:user.name,
				posts:posts
			});
		});
	});
});

//发表微博
router.post('/post', checkLogin);//页面权限控制
router.post('/post',function(req,res){
	var currentUser = req.session.user; //获取当前用户信息
	if(req.body.post == ""){ //发布消息不能为空
		req.flash('error','内容不能为空');
		return res.redirect('/u/'+currentUser.name);
	}
	//实例化Post对象
	var post = new Post(currentUser.name,req.body.post);//req.body.post获取用户发表内容
	
	//调用实例方法，发表微博，并把消息保存到数据库
	post.save(function(err){
		if(err){
			req.flash('error',err);
			return res.redirect('/');
		}
		req.flash('success','发表成功');
		res.redirect('/u/'+currentUser.name);
	});

})
router.post('/reg',checkNotLogin)
router.post('/reg',function(req,res){
	// 用户名 和 密码 不能为空
            if (req.body.username == "" || req.body.userpwd == "" || req.body.pwdrepeat == "") {
                //使用req.body.username获取提交请求的用户名，username为input的name

                req.flash('error', "输入框不能为空！");
                return res.redirect('/reg');//返回reg页面
            }
            // 两次输入的密码不一致，提示信息
            if(req.body.userpwd != req.body.pwdrepeat) {
                req.flash("error", '两次输入密码不一致！');
                return res.redirect('/reg');
            }
            //把密码转换为MD5值
            var md5 = crypto.createHash('md5');
            var password = md5.update(req.body.userpwd).digest('base64');

            //用新注册用户信息对象实例化User对象，用于存储新注册用户和判断注册用户是否存在
            var newUser = new User({
                name: req.body.username,
                password: password,
            });
            // 检查用户是否存在
            User.get(newUser.name,function(err,user){
                // 如果用户存在的话
                 if (user) {
                    err = 'Username already exists.';
                 }
                 if (err) {
                     req.flash('error', err);//保存错误信息，用于界面显示提示
                     return res.redirect('/reg');
                 }
                 // 用户不存在的时候 保存用户
                 newUser.save(function(err){
                 if (err) {
                     req.flash('error', err);
                     return res.redirect('/reg');
                 }
                     req.session.user = newUser;//保存用户名，用于判断用户是否已登录
                     req.flash('success', req.session.user.name + '注册成功');
                     res.redirect('/');
                 });

            });
})
router.get('/login',checkNotLogin);
router.get('/login', function(req, res) {
res.render('login', { title: '用户登录' });

});

router.post('/login', checkNotLogin);
router.post('/login',function(req,res){
	//生成口令的散列值
             var md5 = crypto.createHash('md5');
             var password = md5.update(req.body.userpwd).digest('base64');
             //判断用户名和密码是否存在和正确
             User.get(req.body.username,function(err,user){
                 if(!user) {
                     req.flash('error', '用户名不存在');
                     return res.redirect('/login');
                 }
                 if(user.password != password) {
                     req.flash('error', '用户密码不存在');
                     return res.redirect('/login');
                 }
                 // 保存用户信息
                 req.session.user = user;
                 req.flash("success","登录成功");
                 res.redirect('/');
             });
})
// 用户注销操作
router.get('/logout',checkLogin);
router.get('/logout', function(req, res) {
    req.session.user = null;//清空session
    req.flash('success', '退出成功！');
    res.redirect('/');
});
function checkNotLogin(req,res,next){
     // 如果从session里面获取用户已存在的话
     if (req.session.user) {
         req.flash('error', '已登录');
         return res.redirect('/');
     }
     next();
     //控制权转移：当不同路由规则向同一路径提交请求时，在通常情况下，请求总是被第一条路由规则捕获，
     // 后面的路由规则将会被忽略，为了可以访问同一路径的多个路由规则，使用next()实现控制权转移。
 }
 function checkLogin(req,res,next){
     if (!req.session.user){
         req.flash('error', '未登录');
         return res.redirect('/login');
     }
     //已登录转移到下一个同一路径请求的路由规则操作
     next();
 }


module.exports = router;