const db = require('../db/db_config');

/**
 * @typeof Crimes
 * 
 * @prop {string} fileNumber        - unique crime id number 
 * @prop {string} reportDate        - date, as string    
 * @prop {integer} crimeTypeId      - type of crime id
 * @prop {integer} neighborhoodId   - neighborhoodId id
 * @prop {string} location          - location of crime, as string
 */



/**
 * @class Crimes
 * 
 * Stores all crimes.
 */
class Crimes {
 
  /**
   * Find a Crime type by id.
   * 
   * @param {Integer} crimeTypeId - id of crime type to find
   * @return {string | undefined} - crime type
   */
  static async findCrimeTypeById(crimeTypeId) {
    return db.get(`SELECT crimeType FROM crimetypes WHERE ${db.columnNames.crimetypesTableId} = '${crimeTypeId}'`);
  }

  /**
   * Return an array of all of the crimetypes.
   * 
   * @return {crimeTypes[]}
   */
  static async getAllTypes() {
    return db.all(`SELECT * FROM crimeTypes`);
  }

  /**
   * Return an array of all of the crimes.
   * 
   * @return {Crimes[]}
   */
  static async getAllCrimes() {
    return db.all(`SELECT * FROM crimes LIMIT 20`);
  }

  /**
   * Find a Crime by neighborhoods
   * 
   * @param {Integer[]} neighborhoodIds - id of neighborhoods to find
   * @return {Crimes[]}
   */
  static async getCrimesByNeighborhoods(neighborhoodIds) {
    return db.get(`SELECT * FROM crimes WHERE neighborhoodId in ('${neighborhoodIds.join()}')`); 
  }


  /**
   * Find a Crime by crime types
   * 
   * @param {Integer[]} CrimeTypeIds - id of crime types to find
   * @return {Crimes[]}
   */
  static async getCrimesByTypes(CrimeTypeIds) {
    return db.get(`SELECT * FROM crimes WHERE crimeTypeId in ('${CrimeTypeIds.join()}')`); 
  }

  /**
   * Find a Crime by neighborhoods and crime types
   * 
   * @param {Integer[]} neighborhoodIds - id of neighborhoods to find
   * @param {Integer[]} CrimeTypeIds - id of crime types to find
   * @return {Crimes[]}
   */
  static async getCrimesByTypes(neighborhoodIds, CrimeTypeIds) {
    return db.get(`SELECT * FROM crimes WHERE neighborhoodId in ('${neighborhoodIds.join()}' AND crimeTypeId in ('${CrimeTypeIds.join()}')`); 
  }


}

module.exports = Crimes;
