
构建基于jwt的apigateway; 实现资源访问的控制。 利用express-http-proxy来自动proxy到内部资源服务。 (内部资源服务没有任何的访问限制，不能直接暴露给外部APP访问)
这里的用户资源也来源于内部资源服务。
# 测试API
## POST Request for an token
URL: http://localhost:3000/auth/authenticate
POST-Body:
```
{
    "email": "joe.li@okchem.com",
    "password": "okchem"
}
```
Sample of Response:
```
{
    "msg": null,
    "msgCode": null,
    "success": true,
    "data": {
        "id": 104,
        "userEmail": "joe.li@okchem.com",
        "userRole": "BUYER",
        "userStatus": "ACTIVE",
        "userProfile": {
            "firstName": "joe",
            "lastName": "li",
            "companyName": "ly",
            "country": "CHN",
            "telphone": "8618086068133"
        }
    },
    "chemToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA0LCJ1c2VyRW1haWwiOiJqb2UubGlAb2tjaGVtLmNvbSIsInVzZXJSb2xlIjoiQlVZRVIiLCJ1c2VyU3RhdHVzIjoiQUNUSVZFIiwidXNlclByb2ZpbGUiOnsiZmlyc3ROYW1lIjoiam9lIiwibGFzdE5hbWUiOiJsaSIsImNvbXBhbnlOYW1lIjoibHkiLCJjb3VudHJ5IjoiQ0hOIiwidGVscGhvbmUiOiI4NjE4MDg2MDY4MTMzIn0sImlhdCI6MTUyNTg0NjA2NCwiZXhwIjoxNTI1OTMyNDY0fQ.hIQFv71SHMX2Vd5RPD8ir08LIVeaveZEoN-DQdkxcj0"
}
```

## Request to Resource
Token in the header:
```
chem-token:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA0LCJ1c2VyRW1haWwiOiJqb2UubGlAb2tjaGVtLmNvbSIsInVzZXJSb2xlIjoiQlVZRVIiLCJ1c2VyU3RhdHVzIjoiQUNUSVZFIiwidXNlclByb2ZpbGUiOnsiZmlyc3ROYW1lIjoiam9lIiwibGFzdE5hbWUiOiJsaSIsImNvbXBhbnlOYW1lIjoibHkiLCJjb3VudHJ5IjoiQ0hOIiwidGVscGhvbmUiOiI4NjE4MDg2MDY4MTMzIn0sImlhdCI6MTUyNTg0NjA2NCwiZXhwIjoxNTI1OTMyNDY0fQ.hIQFv71SHMX2Vd5RPD8ir08LIVeaveZEoN-DQdkxcj0
```
In the following request, get user from req buy `req.user`, Try test using 'http://localhost:3000/api/group-buying/application-list/10/1'

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