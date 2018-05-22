# nodejs-starter
Basic User Authentication and Rest API example using MySql and NodeJs 

# Following are the steps to follow to run the project.
  - Install NodeJs. [https://nodejs.org/en/download/]
  - Install MySql. [https://dev.mysql.com/downloads/installer/]
  - Add MySql configuration in : `mysql_config.json`
  - run npm install
  - run server.js

# Following are the APIS.
- Register User

```
curl -XPOST -H 'Content-Type: application/json' 'http://localhost:5000/register' -d
{ 
"name":"Jemin",
"email":"jemin456789@gmail.com",
"password":"pass123"
}
```

- Login User

```
curl -XPOST -H 'Content-Type: application/json' 'http://localhost:5000/login' -d
{ 
"email":"jemin456789@gmail.com",
"password":"pass123"
}
```
`This will give movie list.`

- Logout user
```
curl -XGET 'http://localhost:5000/logout'
```

- Get Movie List
```
curl -XGET 'http://localhost:5000/movie?key=release_date'
```
- Like the Movie. User id is given in body. Ideally it should be from session.

```
curl -XPOST -H 'Content-Type: application/json' 'http://localhost:5000/movie/like' -d
{ 
"id":341689,
"user_id":1
}
```

- Get User names who have liked the movie.
```
curl -XPOST -H 'Content-Type: application/json' 'http://localhost:5000/movie/names' -d
{ 
"id":341689
}
```

- Get the list of movie which user has receently liked.
```
curl -XPOST -H 'Content-Type: application/json' 'http://localhost:5000/movie/recentlyliked'  -d
{ 
"user_id":1
}
```
 
