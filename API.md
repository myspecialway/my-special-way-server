# API
This project exposes the following endpoints:

__http://[host]/login__
**Verb** 
```
POST
```
**Payload**
```
{
    "username": "some-username",
    "password": "some-password"
}
```
**Headers**
```
content-type: application/json
```

### Possible resoponses
**500** server error

**401** username or password are incorrect

**200** OK

**Payload**
```
{
    "accessToken": "<jwt token>",
    "role": "<TEACHER|PRINCIPLE|STUDENT>"
}
```
This enpoint is responsible for receiving jwt token to be used later for graphql api