var express = require("express");
var login = require('./routes/loginroutes');
var movie = require('./routes/movie');
var mysql = require('./mysqlconnection');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var path = require('path');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

 //Following code is commented just for demo purpose. When we have proper UI then we need to use this code for session management.

/*app.use(session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000, // 30 min
    activeDuration: 5 * 60 * 1000, // 5 min
    httpOnly: true,
    secure: true,
    ephemeral: true
  }));

 app.use('/movie*',function(req, res, next) {
      console.log(req.session);
    if (req.session && req.session.user) {
        mysql.pool.query('SELECT * FROM user WHERE email = ? ',[req.session.user.email], function (error, results, fields) {
            if (results) {
                req.user = results[0];
                delete req.user.password; // delete the password from the session
                req.session.user = results[0];  //refresh the session value
              }
              // finishing processing the middleware and run the route
              next();
            });
          } else {
              console.log("In else");
             // res.redirect('/login.html');
              req.body.email = "jemin456789@gmail.com";
              req.body.password = "pass123";
              res.redirect('/login');
          }
    });*/

//route to handle user registration
app.post('/register',login.register);
app.post('/login',login.login);
app.get('/logout',login.logout);
app.get('/movie',movie.search);
app.post('/movie/like',movie.like);
app.post('/movie/names',movie.names);
app.post('/movie/recentlyliked',movie.recentlyLiked);

app.listen(5000);