/**
 * Send reponse with error.
 * 
 * @param {*} error 
 * @param {*} res 
 */
exports.reportError = function(error, res) {
    console.log("error ocurred", error);
    res.send({
      "code": 400,
      "failed": "error ocurred"
    })
  }