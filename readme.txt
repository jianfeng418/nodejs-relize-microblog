基于nodejs，mongodb数据库的简易微博，采用express架构实现。

1.启动mongodb数据库服务器，找到mongodb安装目录下文件夹bin,运行mongod.exe

2.命令行到当前目录，启动nodejs服务器：
-> npm start 
或者采用node命令启动bin目录下的www文件 
-> node bin/www 
为便于开发，代码更改实时体现，可以安装supervisor插件，以supervisor命令运行www文件
-> supervisor bin/www

3.服务器监听于3000端口，浏览器访问127.0.0.1:3000