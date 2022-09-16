const express = require("express");
const cors = require('cors') 
const app = express();
var bodyParser = require('body-parser')
require('dotenv').config()
const session = require("express-session");
const connectRedis = require("connect-redis");
const RedisStore = connectRedis(session);

var userControllers = require("./config/controllers/UserControllers")
var backtesterControllers = require("./config/controllers/BacktesterControllers")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(
  {"origin": "*"}
))

app.post("/ticker", backtesterControllers.getChart);
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

// Login and Registration Testing

// const db = require('./config/db');

// db.authenticate().then(() => {
//   console.log('Database connected...');
// }).catch(err => {
//   console.log('Error: ' + err);
// })

// const { createClient } = require('redis')
// const redisClient = createClient({
//   host: 'localhost',
//   port: 6379,
//   legacyMode: true,
// })

// redisClient.connect()

// redisClient.on('error', function (err) {
//   console.log('Could not establish a connection with redis. ' + err);
// });

// redisClient.on('connect', function (err) {
//   console.log('Connected to redis successfully');
// });

// const SESSION_SECRET = process.env.SESSION_SECRET;

// app.use(cors(
//   {"origin": process.env.APP_FRONTEND_URL}
// ))

// app.use(
//   session({
//     store: new RedisStore({ client: redisClient }),
//     secret: "SESSION_SECRET",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === 'production',  // if true only transmit cookie over https
//       httpOnly: true, // if true prevent client side JS from reading the cookie
//       maxAge: 1000 * 60 * 10, // session max age in milliseconds
//     },
//   })
//  );
  
// app.post("/login", userControllers.userLogin);

// app.post("/signup", userControllers.userSignUp);


// app.post("/logout", (req, res) => {
//   req.session.destroy()
//   return res.sendStatus(200)
// });
  
// db.sync().then(() => {
//   app.listen(PORT, console.log(`Server started on port ${PORT}`));
// }).catch(err => console.log("Error: " + err));

