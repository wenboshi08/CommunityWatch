const express = require('express');

const Neighborhoods = require('../models/Neighborhoods');
const v = require('./validators');
const router = express.Router();


/**
 * List all neighborhoods.
 * 
 * @name GET /api/neighborhoods
 * @return {Neighborhoods[]} - list of neighborhoods
 */
router.get(
  '/', 
  [],
  async (req, res) => {
  try {
    // fetch all the neighborhoods from our DB
    const allNeighborhoods = await Neighborhoods.findAll();
    res.status(200).json({"all": allNeighborhoods}).end();

  } catch (error) {
    res.status(503).json({ error: `Could not fetch all neighborhoods: ${error}` }).end();
  }
});


/**
 * Get a particular neighborhood by id
 * 
 * @name GET /api/neighborhoods/:id
 * :name is the id of the neighborhood
 * @return {Neighborhood} - the resulting neighborhood
 * @throws {404} - if neighborhood does not exist
 */
router.get(
  '/:id', 
  [
    v.ensureValidNeighborhoodIdInBody,
  ],
  async (req, res) => {
  try {

    const neighborhoodId = req.params.id;

    // ensure that the given neighborhood exists in our DB
    const neighborhood = await Neighborhoods.findOneById(neighborhoodId);
    if (!neighborhood) {
      res.status(404).json({
        error: `Neighborhood with id ${neighborhoodId} does not exist`,
      }).end();
      return;
    }
  } catch (error) {
    res.status(503).json({ error: `Could not retrieve the neighborhood: ${error}` }).end();
  }
});


module.exports = router;
