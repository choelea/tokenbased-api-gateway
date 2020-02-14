# 简易鉴权Api网关
基于nodejs  express jwt技术构建的apigateway, 实现资源访问的控制。 利用express-http-proxy来自动proxy到内部资源服务。 (内部资源服务没有任何的访问限制，不能直接暴露给外部APP访问)

- 支持Docker部署
- 可配置化

![token-based-api-proxy.jpg](http://tech.jiu-shu.com/Nodejs-Technologies/token-based-api-proxy.jpg)


# Docker部署快速开始
这里以1.0版本为例
### 拉取镜像
```
docker pull registry.cn-qingdao.aliyuncs.com/jiu-shu/api-proxy:1.0
```
### 创建配置文件目录及配置文件
这里假定创建配置文件目录 `/root/api-gateway/config`，在目录下面添加配置文件tokenbased-api-gateway.json 内容如下：
```
{
    "authenticateUrl": "http://10.3.69.10:4001/authenticate",
    "jwtExpire": 86400, 
    "tokenSecret": "jiushu2020!!@#$$", 
    "resources":[
      {
        "prefix":"/users",
        "stripPrefix":false,
        "endpoint":"http://10.3.69.10:4001",
        "isAuthenticationNeeded":false
      },
      {
        "prefix":"/oapi",
        "stripPrefix":true,
        "endpoint":"http://10.3.69.10:4002",
        "isAuthenticationNeeded":true
      }
    ]
  }
```
### 启动容器
```
docker run —name ApiGateway -p  9000:3000 -d -v /root/api-gateway/config:/usr/config registry.cn-qingdao.aliyuncs.com/jiu-shu/api-proxy:1.0 
```
这里假设后端服务有两个：用户服务(端口4001)和订单服务(端口4002);其中鉴权服务URL：http://localhost:4001/authenticate。  
 - 访问用户： http://localhost:9000/users/0 
 - 访问订单： http://localhost:9000/opai/orders/2020021000

### 用户登录API
POST 9000:/auth/authenticate 请求JSON如下：
```
{
	"username":"jiu-shu",
	"password":"123456"
}
```
响应JSON
 ```
 {
    "useInfo": {
        "username": "jiu-shu",
        "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImppdS1zaHUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODE2NTE3NzQsImV4cCI6MTU4MTczODE3NH0.weNpFy9M7BbuzKmQBW0Z4QyFi1itFz26GgURJhPNtI4"
}
 ```
### 其他API调用
header带上xtoken 值为登录获取的token。
# 配置文件说明
### authenticateUrl
提供用户鉴权的后台服务接口URL， 接口规范遵循post 请求 restful规范，请求/响应内容如下：
请求JSON 如下：
```
{
    "username": "joe.li@foxmail.com",
    "password": "123456"
}
 ```
正确返回用户信息：（状态:200）

```
{
    "username": "joe.li@foxmail.com",
    "role": "admin",
	"name":"Joe Li"
}
```
> 返回需要的用户的信息的JSON格式即可，对属性没有任何要求

### jwtExpire
jwt token的过期时间

### tokenSecret
用于签名的秘钥

### 后端资源服务配置
后端被保护资源的服务数组：
#### prefix
服务请求路由的前缀
#### stripPrefix
在将请求转发至后端服务的时候是否需要去掉前缀，假如请求是：http://localhost:9000/oapi/orders/2020021000, 过滤后转发至后端服务的请求就是http://10.3.69.10:4002/orders/2020021000。 
#### endpoint
后端服务的节点
#### isAuthenticationNeeded
是否需要鉴权




# Something you may concern
Here, the jwt is actually an 'value token', not an 'reference token'. Mostly the value token is rolling when request continues. It's more like an 
Access Token. Here we set the expire time to 24 hours. For me, I believe one use an app for 24 hours, so it's not an issue. But rolling is what you need, I suggest below 2 solutions.
 -  Switch to reference token. Changes needed:
    -  Involve such as redis to store value which the token refer
    -  Fetch value from redis after you got the token 
    -  Extend the expire data in redis
 -  Add refresh API to refresh a new token, so that app can call to refresh a new token each 30 minutes.
    -  Refresh API will check access token
    -  Only refresh a new token if the access is about to expire in 1 hour