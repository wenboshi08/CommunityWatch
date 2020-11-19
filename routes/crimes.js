const express = require('express');

const Crimes = require('../models/Crimes');
const v = require('./validators');
const router = express.Router();


/**
 * List all neighborhoods.
 * 
 * @name GET /api/crime
 * @return {Crimes[]} - list of all crimes
 */
router.get(
  '/', 
  [],
  async (req, res) => {
  try {
    // fetch all the crimes from our DB
    const allCrimes = await Crimes.getAllCrimes();
    res.status(200).json(allCrimes).end();

  } catch (error) {
    res.status(503).json({ error: `Could not fetch all crimes: ${error}` }).end();
  }
});


module.exports = router;