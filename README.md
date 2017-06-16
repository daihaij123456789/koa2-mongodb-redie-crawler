# koa2-mongodb-redie-crawler

使用koa2 + mongodb + redis 爬取segmentfault头条首页数据中的最新和最热数据

## 如何运行
首先需要确保已安装 mongodb和redis 并以开启mongodb和redis服务，之后执行以下命令
```
cd nodejs-crawler
npm install
npm start
```
打开浏览器访问`localhost:3000/users/news ` 或者 `localhost:3000/users/newest  `

## 总体结构
* routes 处理请求     
* lib/controllers: 确保有数据返回(无数据就去执行爬虫) 主要是业务逻辑操作
* lib/bll: 完全对数据库操作 返回Promise    
* lib/model: 数据库映射   
* lib/crawler: 爬虫程序,返回Promise  

## 流程    
* 客户端发送请求   

* 服务端接收请求      
  2.1 redis缓存中有无数据.有数据则返回;无数据则查询mongodb    
  2.2 查询mongodb有数据则缓存到redis并返回,无数据则去执行爬虫    
  2.3 爬虫获取的结果保存到mongodb中 

## 环境安装
#### 安装mongodb 
```
brew install mongodb
```
#### 指定数据存储目录：
```
mkdir -p /data/db
mongod --dbpath=/data/db --port=27017 #启动mongodb服务
mongod --dbpath=/data/db --port=27017 --fork #以守护进程方式启动
```

#### 安装redis
```
brew install redis
```
#### 启动redis
```
redis-server
redis-server & #守护进程方式启动
```

