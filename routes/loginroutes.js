var bcrypt = require('bcrypt-nodejs');
var mysql = require('../mysqlconnection');
var util = require('../util');

/**
 * This module is used to register new user.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.register = function (req, res) {
  var today = new Date();
  var salt = bcrypt.genSaltSync(10);
  var user = {
    "name": req.body.name,
    "email": req.body.email,
    "password": bcrypt.hashSync(req.body.password, salt),
    "created": today,
    "modified": today
  }
  const result = mysql.syncConnection.query('SELECT email FROM users where email = ?', [req.body.email]);
  if(result.length >=0){
    res.send({
      "code": 400,
      "success": "Email Address already registered"
    });
  }
  mysql.pool.query('INSERT INTO users SET ?', user, function (error, results, fields) {
    if (error) {
      util.reportError(error, res);
    } else {
      res.send({
        "code": 200,
        "success": "User registered sucessfully"
      });
    }
  });
}

/**
 * Authenticate user with email and password.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.login = function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  mysql.pool.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
    if (error) {
      util.reportError(error, res);
    } else {
      if (results.length > 0) {
        if (bcrypt.compareSync(password, results[0].password)) {
          //req.session.user = results[0];// Store user information in session.
          res.redirect('/movie'); // redirect to movie page.
        } else {
          res.send({
            "code": 204,
            "success": "Email and password does not match"
          });
        }
      } else {
        res.send({
          "code": 204,
          "success": "Email does not exits"
        });
      }
    }
  });
}

/**
 * Used to logout User and clear the cookie.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.logout = function (req, res) {
  if (req.session) {
    req.session.reset();
  }
  // Should redirect to login page from ui.
  res.end();
}