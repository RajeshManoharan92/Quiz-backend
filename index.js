const mongo = require("./shared")
const express = require('express')
const router = require("./module/module")
require('dotenv').config()
const cors = require('cors')

mongo.connect();

var app = express();

app.use(express.json());

app.use(cors());

app.use("/" , router )

app.listen(process.env.PORT||3002, () => {
  console.log(`Server running on port ${3002}`);
})

