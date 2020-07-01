const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3000;

const app = express();

const redirectToHTTPS = require("express-http-to-https").redirectToHTTPS;

app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

app.get('/', function (req,res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/insecure", function(req, res) {
  res.send("You are on an insecure connection! Please change the front of the url from 'http://' to 'https:// and try again.");
});

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false,
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
