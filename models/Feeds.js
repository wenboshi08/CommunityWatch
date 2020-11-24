const db = require('../db/db_config');

/**
 * @typeof Feed
 *
 * @prop {integer} userId           - user id
 * @prop {integer} neighborhoodId   - neighborhoodId id
 *
 */

/**
 * @class Feeds
 *
 * Stores all feeds.
 */

class Feeds {
    /**
     * Add a Feed.
     *
     * @param {integer} userId - User Id in users Table
     * @param {integer} neighborhoodId - Neighborhood Id in neighborhoods Table
     * @return {Feed} - created feed
     */
    static async addOne(userId, neighborhoodId) {
        // first insert the feed into the DB and wait for completion
        // and then fetch the new feed from the DB
        return db.run(`INSERT INTO feeds (${db.columnNames.feedTableUserId}, ${db.columnNames.feedTableNeighborhoodId}) VALUES ('${userId}', ${neighborhoodId})`)
            .then(() => {
                return Feeds.findOne(userId, neighborhoodId);
            });
    }

    /**
     * Find a Feed by User Id and Neighborhood Id.
     *
     * @param {integer} userId - User Id in users Table
     * @param {integer} neighborhoodId - Neighborhood Id in neighborhoods Table
     * @return {Feed | undefined} - found Feed
     */
    static async findOne(userId, neighborhoodId) {
        return db.get(`SELECT * FROM feeds WHERE ${db.columnNames.feedTableUserId} = '${userId}' AND ${db.columnNames.feedTableNeighborhoodId} = '${neighborhoodId}'`);
    }

    /**
     * Delete a Feed.
     *
     * @param {integer} userId - User Id in users Table
     * @param {integer} neighborhoodId - Neighborhood Id in neighborhoods Table
     * @return {Feed | undefined} - found Feed
     */
    static async deleteOne(userId, neighborhoodId) {
        // first fetch the feed from the DB
        // and then delete it from the DB, waiting for completion
        return Feeds.findOne(userId, neighborhoodId)
            .then( (feed) => {
                db.run(`DELETE FROM feeds WHERE ${db.columnNames.feedTableUserId} = '${userId}' AND ${db.columnNames.feedTableNeighborhoodId} = '${neighborhoodId}'`);
                return feed;
            });
    }

    /**
     * Find a Feed List by User Id.
     *
     * @param {integer} userId - User Id in users Table
     * @return {Feed[]} - found Feeds
     */
    static async findByUserId(userId) {
        return db.all(`SELECT * FROM feeds WHERE ${db.columnNames.feedTableUserId} = '${userId}'`);
    }

    /**
     * Find a Feed List by Neighborhood Id.
     *
     * @param {integer} neighborhoodId - Neighborhood Id in neighborhoods Table
     * @return {Feed[]} - found Feeds
     */
    static async findByNeighborhoodId(neighborhoodId) {
        return db.all(`SELECT * FROM feeds WHERE ${db.columnNames.feedTableNeighborhoodId} = '${neighborhoodId}'`);
    }


    /**
     * Return an array of all of the Feeds.
     *
     * @return {Feed[]}
     */
    static async findAll() {
        return db.all(`SELECT * FROM feeds`);
    }

}

module.exports = Feeds;