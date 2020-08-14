const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 8080
const cors = require("cors")
require('dotenv').config()

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
// app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (request, response) => {
    response.json({ info: 'React, Node.js, Express, and Postgres API' })
  })

  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })