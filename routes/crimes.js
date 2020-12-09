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
    let type = req.query.type;
    let neigh = req.query.neigh;
    let from_ = req.query.from_;
    let to_ = req.query.to_;
    let allCrimes = await Crimes.getAllCrimes(type, neigh, from_, to_);

    let resolvePromise = async (crime) => {
      let crimeType = await Crimes.findCrimeTypeById(crime.crimeTypeId); 
      let neighborhood = await Neighborhoods.findOneById(crime.neighborhoodId); 
      return ({
        crimeTypeId: crime.crimeTypeId, 
        crimeType: crimeType.crimeType,
        fileNumber: crime.fileNumber,
        location: crime.location,
        latitude: crime.latitude,
        longitude: crime.longitude,
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

/**
 * List all neighborhoods.
 * 
 * @name GET /api/crime
 * @return {Crimes[]} - list of all crimes
 */
router.put(
  '/mine', 
  [],
  async (req, res) => {
  try {    
    // fetch all the crimes from our DB
    let neigh_list = req.body.neigh;
    let neigh = "(";
    neigh_list.forEach(n => neigh = neigh + n + ",");
    neigh = neigh.slice(0, -1) + ")";

    if(neigh === ")"){
      return res.status(200).json([]).end();
    }

    let type = req.query.type;
    let from_ = req.query.from_;
    let to_ = req.query.to_;
    let allCrimes = await Crimes.getMyCrimes(type, neigh, from_, to_);
    console.log(allCrimes);

    let resolvePromise = async (crime) => {
      let crimeType = await Crimes.findCrimeTypeById(crime.crimeTypeId); 
      let neighborhood = await Neighborhoods.findOneById(crime.neighborhoodId); 
      return ({
        crimeTypeId: crime.crimeTypeId, 
        crimeType: crimeType.crimeType,
        fileNumber: crime.fileNumber,
        location: crime.location,
        latitude: crime.latitude,
        longitude: crime.longitude,
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

/**
 * List all crimeTypes.
 * 
 * @name GET /api/crimes/types
 * @return {Crimetypes[]} - list of neighborhoods
 */
router.get(
  '/types', 
  [],
  async (req, res) => {
  try {
    // fetch all the neighborhoods from our DB
    const allCrimeTypes = await Crimes.getAllTypes();
    res.status(200).json({"all": allCrimeTypes}).end();

  } catch (error) {
    res.status(503).json({ error: `Could not fetch all crimetypes: ${error}` }).end();
  }
});


module.exports = router;