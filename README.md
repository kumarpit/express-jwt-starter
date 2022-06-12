# Express JWT Template
A boilerplate for an express app that require JWT authentication via a MongoDB database.

### Installation
Install the required dependencies using `npm install` and start the server using `npm start`. You will need to create a `.env` file in the root directory and define the following environment variables:
```
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET
MONGODB_URI=mongodb://localhost:27017/{YOUR DB NAME}
```
You can generate token secrets by running the following command in `node` (make sure you use different secrets for access tokens and refresh tokens)
```javascript
require('crypto').randomBytes(64).toString('hex')
```
Lastly, make sure you have MongoDB running. You should now have the server up and running on port `3000`.

### Usage
The following routes have been implemented:
```javascript
/user "create a new user"
/login "returns user access and refresh tokens"
/logout "destroys all tokens associated to the user"
/token "generates a new access token"
/echo "returns username stored in the access token"
```

### `/user`
The `/user` endpoint saves a the new user's username and hashed password to the `Users` collection in the database. The `username` field is validated to be unique.
```javascript
POST localhost:3000/user
```
#### Headers
```javascript
Content-Type: application/json
```
#### Body
```javascript
{
  username: string,
  password: string
}
```

### `/login`
The `/login` endpoint returns access and refresh tokens if the user signs in with valid credentials. The access token is set to be valid for 15 minutes, after which it is the client's responsiblity to generate new tokens by requesting the `/token` endpoint (see below).
```javascript
POST localhost:3000/login
```
#### Headers
```javascript
Content-Type: application/json
```
#### Body
```javascript
{
  username: string,
  password: string
}
```
#### Response
```javascript
{
  access_token: string,
  refresh_token: string
}
```

### `/token`
The `/token` endpoint returns a new access token given a valid refresh token.
```javascript
POST localhost:3000/token
```
#### Headers
```javascript
Content-Type: application/json
```
#### Request Body
```javascript
{
  refresh_token: string
}
```
#### Response
```javascript
{
  new_access_token: string
}
```

### `/logout`
The `/logout` endpoint invalidates the user's refresh token. However, the access token remains valid if it hasn't timed out, hence it is the client's responsibility to discard the access token.
```javascript
POST localhost:3000/logout
```
#### Headers
```javascript
Content-Type: application/json
```
#### Request Body
```javascript
{
  refresh_token: string
}
```

### `/echo`
The `/echo` endpoint reads the username from the access token and returns a `hello, {username}` message. This endpoint serves as an example of routes that validate the access token.
```javascript
GET localhost:3000/echo
```
#### Headers
```javascript
Content-Type: application/json
Authorization: {access token}
```
