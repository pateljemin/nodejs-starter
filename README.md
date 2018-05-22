# nodejs-starter
Basic User Authentication and Rest API example using MySql and NodeJs. Steps to host on Heroku.

# Following are the steps to run the project.
  - Install NodeJs. [https://nodejs.org/en/download/]
  - Install MySql. [https://dev.mysql.com/downloads/installer/]
  - Add MySql configuration in : `mysql_config.json`
  - Run `npm install` 
  - Run  `node server.js`

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
"user_id":1,
"liked":1
}
```

- Unlike the Movie. 

```
curl -XPOST -H 'Content-Type: application/json' 'http://localhost:5000/movie/like' -d
{ 
"id":341689,
"user_id":1,
"liked":-1
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

# Host on Heroku.

You can host this website for free on heroku with limited functionality.

- Follow the steps from heroku blog : https://devcenter.heroku.com/
- You can use different functionality on heroku as a Addon. For MySql you can use `CleanDb` addon.
- Once you use this addon you need to run `heroku config:add DATABASE_URL=mysql://b9569b90d54261:0a7276d4@us-cdbr-iron-east-04.cleardb.net/heroku_5aa751c5283805c?reconnect=true`. Since Heroku is using DBPATH from enviroment variable.
- You can connect ClearDB with your own MySQl workbench and you can access your remote ClearDB. All information is given in this url : `mysql://b9569b90d54261:0a7276d4@us-cdbr-iron-east-04.cleardb.net/heroku_5aa751c5283805c`
- HOST : `us-cdbr-iron-east-04.cleardb.net`
- DBNAME: `heroku_5aa751c5283805c`
- USER : `b9569b90d54261`
- PASSWORD : `0a7276d4`


 
