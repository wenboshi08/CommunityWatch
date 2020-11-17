const express = require('express');

const Shorts = require('../models/Shorts');
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
