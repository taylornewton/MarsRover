'use strict';

const express = require('express'),
  app = express();

const PORT = 8080;
const HOST = '0.0.0.0';

app.use(express.static(__dirname + '/public'))
app.use(require('./controllers'));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);