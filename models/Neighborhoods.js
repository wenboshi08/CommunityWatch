// TODO: test functions

const db = require('../db/db_config');

/**
 * @typeof Neighborhoods
 * 
 * @prop {string} name - neighborhood name
 */

/**
 * @class Neighborhoods
 * 
 * Stores all neighborhoods.
 * Note that the neighborhoods table can only be used to retrieve dt, and not add/update or delete data
 */
class Neighborhoods {
 
  /**
   * Find a Neighborhood by id.
   * 
   * @param {Integer} neighborhoodName - id of Neighborhood to find
   * @return {Short | undefined} - found Neighborhood
   */
  static async findOneById(neighborhoodId) {
    return db.get(`SELECT * FROM neighborhoods WHERE ${db.columnNames.id} = '${neighborhoodId}'`);
  }

  /**
   * Return an array of all of the Neighborhoods.
   * 
   * @return {Neighborhood[]}
   */
  static async findAll() {
    return db.all(`SELECT * FROM neighborhoods`);
  }


}

module.exports = Neighborhoods;
