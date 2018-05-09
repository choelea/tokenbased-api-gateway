# POST Request for an token
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

# Request to Resource
Token in the header:
```
chem-token:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA0LCJ1c2VyRW1haWwiOiJqb2UubGlAb2tjaGVtLmNvbSIsInVzZXJSb2xlIjoiQlVZRVIiLCJ1c2VyU3RhdHVzIjoiQUNUSVZFIiwidXNlclByb2ZpbGUiOnsiZmlyc3ROYW1lIjoiam9lIiwibGFzdE5hbWUiOiJsaSIsImNvbXBhbnlOYW1lIjoibHkiLCJjb3VudHJ5IjoiQ0hOIiwidGVscGhvbmUiOiI4NjE4MDg2MDY4MTMzIn0sImlhdCI6MTUyNTg0NjA2NCwiZXhwIjoxNTI1OTMyNDY0fQ.hIQFv71SHMX2Vd5RPD8ir08LIVeaveZEoN-DQdkxcj0
```
In the following request, get user from req buy `req.user`, Try test using 'http://localhost:3000/test'

# Need to do
 -  Add Authentication middleware to restrict user's access to special resources
 -  Add http-proxy to leverage the Authentication middleware and delegate request to resource server.