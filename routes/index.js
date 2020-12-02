const express = require('express');

const v = require('./validators');

const router = express.Router();

/**
 * Serves homepage.
 * @name GET /
 */
router.get(
  '/', 
  [],
  async (req, res) => {
  res.render('index');
});


module.exports = router;
