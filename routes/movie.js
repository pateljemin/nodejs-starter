var mysql = require('../mysqlconnection');
var util = require('../util');
/**
 * This module is used to provide list of movies. Result is sorted based on Sort Key given.
 * Ex. Sort based on Vote Count or Release Date.
 * @param {*} req 
 * @param {*} res 
 */
exports.search = function (req, res) {
  var query = req.query.query;
  var sort_key = req.query.key;
  var user_id = 1; // this will come from req.session.user.id
  if (query) {
    query = '%' + query + '%'
    mysql.pool.query('SELECT * FROM movie WHERE title like ? or overview like ? order by ? desc', [query, query, sort_key], function (error, results, fields) {
      if (error) {
        util.reportError(error);
      } else {
        res.send(toJsonMovie(results, user_id));
      }
    })
  } else {
    mysql.pool.query('SELECT * FROM movie order by ? desc limit 1,10', [sort_key], function (error, results, fields) {
      if (error) {
        util.reportError(error);
      } else {
        res.send(toJsonMovie(results, user_id));
      }
    })
  }
}

/**
 * This module is used to like movie for a user..
 *
 * @param {*} req

 * @param {*} res 
 */
exports.like = function (req, res) {
  var movie_id = req.body.id;
  //var user_id = req.session.user.id;
  var user_id = req.body.user_id; // this will come from req.session.user.id
  mysql.pool.query('update movie set vote_count = vote_count + ? where id = ? ', [req.body.liked, movie_id], function (error, results, fields) {
    if (error) {
      util.reportError(error);
    } else {
      // Sync Connection is used to execute query in sync.
      const result = mysql.syncConnection.query('SELECT liked FROM favourite where movie_id = ? and user_id = ?', [movie_id, user_id]);
      if (result.length > 0) {
        mysql.syncConnection.query('update favourite set liked = ? where movie_id = ? and user_id = ?', [req.body.liked, movie_id, user_id]);
      } else {
        var fav = {
          user_id: user_id,
          movie_id: movie_id,
          liked: req.body.liked,
          date: new Date()
        }
        mysql.pool.query('INSERT INTO favourite SET ?', fav, function (error, results, fields) {
          if (error) {
            util.reportError(error);
          } else {
            res.send({
              "code": 200,
              "success": "User registered sucessfully"
            });
          }
        });
      }
    }
    res.end();
  })
}

/**
 * This module is used to provide list of user names who have perform like on given movie.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.names = function (req, res) {
  var movie_id = req.body.id;
  const result = mysql.syncConnection.query('SELECT user_id FROM favourite where movie_id = ? order by date desc', [movie_id]);
  if (result.length > 0) {
    var user_ids = [];
    result.forEach(element => {
      user_ids.push(element['user_id']);
    });
    const names = mysql.syncConnection.query('SELECT name FROM users where id in(?)', [user_ids.join()]);
    var user_names = [];
    names.forEach(element => {
      user_names.push(element['name']);
    });
    res.send(user_names.join());
    return;
  }
  res.send("");
}

/**
 * This module used to provide list of recently liked movies by user.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.recentlyLiked = function (req, res) {
  var user_id = req.body.user_id;
  const result = mysql.syncConnection.query('SELECT movie_id FROM favourite where user_id = ? and liked = 1 order by date desc', [user_id]);
  if (result.length > 0) {
    var movie_ids = [];
    result.forEach(element => {
      movie_ids.push(element['movie_id']);
    });
    const movies = mysql.syncConnection.query('SELECT * FROM movie where id in(?)', [movie_ids.join()]);
    res.send(toJsonMovie(movies, user_id));
    return;
  }
  res.send("");
}

/**
 * Get like count for given movie.
 * 
 * @param {*} movieid 
 */
var getLikeCount = function (movieid) {
  const result = mysql.syncConnection.query('SELECT count(*) as count FROM favourite where movie_id = ? and liked = 1', [movieid]);
  console.log("Get Liked Count:" + result[0].count);
  return result[0].count;
}

/**
 * Check is this movie is liked by user or not.
 * 
 * @param {*} movie_id 
 * @param {*} user_id 
 */
var isMovieLiked = function (movie_id, user_id) {
  const result = mysql.syncConnection.query('SELECT liked FROM favourite where movie_id = ? and user_id = ?', [movie_id, user_id]);
  if (result.length == 0) {
    return 0;
  }
  return result[0].liked;
}

/**
 * Transform DB Object to User visible movie object. 
 * 
 * @param {*} movies 
 * @param {*} user_id 
 */
var toJsonMovie = function (movies, user_id) {
  console.log(movies);
  var shortMovies = [];
  for (var i = 0; i < movies.length; i++) {
    var movie = {
      id: movies[i].id,
      name: movies[i].title,
      overview: movies[i].overview,
      original_language: movies[i].original_language,
      adult: movies[i].adult,
      release_date: movies[i].release_date,
      like_count: getLikeCount(movies[i].id),
      isUserLiked: isMovieLiked(movies[i].id, user_id)
    }
    console.log(movie);
    shortMovies.push(movie);
  }
  return JSON.stringify(shortMovies);
}