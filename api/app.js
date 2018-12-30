const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const faker = require("faker");
const times = require("lodash.times");
const random = require("lodash.times");

// import all db models
const db = require("./models");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  let data = {
    code: err.status || 500,
    message: err.message || "Not found"
  };
  // render the error page
  res.status(err.status || 500);
  res.send(data);
});

// create tables based on models created
db.sequelize.sync().then(() => {
  // populate user table with dummy data
  db.User.bulkCreate(
    times(10, () => ({
      username: faker.name.firstName()
    }))
  );
});

module.exports = app;
