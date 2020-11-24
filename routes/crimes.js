const express = require('express');

const Crimes = require('../models/Crimes');
const Neighborhoods = require('../models/Neighborhoods');
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
    let allCrimes = await Crimes.getAllCrimes();

    let resolvePromise = async (crime) => {
      let crimeType = await Crimes.findCrimeTypeById(crime.crimeTypeId); 
      let neighborhood = await Neighborhoods.findOneById(crime.neighborhoodId); 
      return ({
        crimeTypeId: crime.crimeTypeId, 
        crimeType: crimeType.crimeType,
        fileNumber: crime.fileNumber,
        location: crime.location,
        neighborhoodId: crime.neighborhoodId, 
        neighborhood: neighborhood.neighborhood, 
        reportDate: crime.reportDate,
      });
    }

    let promises = allCrimes.map((crime) => {
      return resolvePromise(crime); 
    }); 
    Promise.all(promises).then((results) => {
      res.status(200).json(results).end();
    })
  } catch (error) {
    res.status(503).json({ error: `Could not fetch all crimes: ${error}` }).end();
  }
});


module.exports = router;