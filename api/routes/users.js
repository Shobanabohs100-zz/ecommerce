var express = require("express");
var router = express.Router();
const logger = require("winston");

const db = require("../models");

/* GET users listing. */
router.get("/", function(req, res, next) {
  db.User.findAll().then(result => {
    let data = {
      code: 200,
      message: "success",
      data: result
    };
    res.json(data);
  });
});

router.use(function(err, req, res, next) {
  logger.log("error", "Houston, we have a problem: MESSAGE", err);
  if (err.code) {
    res.status(err.code).json({
      code: err.code,
      message: err.message,
      context: err.data && err.data.message ? err.data.message : ""
    });
  }
  res.status(500).json({
    status: "500",
    message: "Something went wrong",
    context:
      "Check your internet connection or If the problem persist, contact system administrator"
  });
});

module.exports = router;
