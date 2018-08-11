const express = require('express'),
  router = express.Router(),
  path = require('path');

router.use('/photos', require('./photos'));

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', "index.html"));
});

module.exports = router;