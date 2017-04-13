//获取微博和保存微博
var mongodb = require('./db');
//Post构造函数，用于创建对象

function Post(username,content,time){
	this.user = username;//用户名
	this.content = content;//用于发布内容
	if(time){
		this.time = time;//发布时间
	}else{
		var now = new Date();
		this.time = now.getFullYear()+"/"+(now.getMonth()+1)+"/"+now.getDate()+" "+now.getHours()+":"+now.getSeconds();
		
	}
}
//输出Post对象
module.exports = Post;

//对象方法；保存新发布的微博到数据库
Post.prototype.save = function(callback){
	//存入mongodb数据库
	var post = {
		user:this.user,
		post:this.content,
		time:this.time
	};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		//读取Posts集合，级数据库表
		db.collection('posts',function(err,collection){
			if(err){
				mongodb,close();
				return callback(err);
			}
			//为user属性添加索引
			collection.ensureIndex('user');
			//吧发布的微博信息post写入posts表中
			collection.insert(post,{safe:true},function(err,post){
				mongodb.close();
				callback(err,post);
			});
			
		});
	});
}
//获取全部或指定用户的微博记录
Post.get = function get(username,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		//读取post集合
		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//查找user属性为username的微博记录，如果username为null，则查找全部记录
			var query = {};
			if(username){
				query.user = username;
			}
			//查找符合条件的记录，并按时间顺序排序
			collection.find(query).sort({time:-1}).toArray(function(err,docs){
				mongodb.close();
				if(err){
					callback(err,null);
				}
				var posts = [];
				//遍历查询结果
				docs.forEach(function(doc,index){
					//吧结果封装成Post对象
					var post = new Post(doc.user,doc.post,doc.time);
					//把全部结果封装成数组
					posts.push(post);
				});
				callback(null,posts);
			})
		})
	})
}
