const db = require('../db/db_config');

/**
 * @typeof Upvote
 *
 * @prop {integer} userId           - user id
 * @prop {integer} postId   - post id
 *
 */

/**
 * @class Upvotes
 *
 * Stores all upvotes.
 */

class Upvotes {
    /**
     * Add a Upvote.
     *
     * @param {integer} userId - User Id in users Table
     * @param {integer} postId - Post Id in posts Table
     * @return {Upvote} - created upvote
     */
    static async addOne(userId, postId) {
        // first insert the upvote into the DB and wait for completion
        // and then fetch the new upvote from the DB
        return db.run(`INSERT INTO upvotes (${db.columnNames.upvoteTableUserId}, ${db.columnNames.upvoteTablePostId}) VALUES ('${userId}', '${postId}')`)
            .then(() => {
                return Upvotes.findOne(userId, postId);
            });
    }

    /**
     * Find a Upvote by User Id and Post Id.
     *
     * @param {integer} userId - User Id in users Table
     * @param {integer} postId - Post Id in posts Table
     * @return {Upvote | undefined} - found Upvote
     */
    static async findOne(userId, postId) {
        return db.get(`SELECT * FROM upvotes WHERE ${db.columnNames.upvoteTableUserId} = '${userId}' AND ${db.columnNames.upvoteTablePostId} = '${postId}'`);
    }

    /**
     * Delete a Upvote.
     *
     * @param {integer} userId - User Id in users Table
     * @param {integer} postId - Post Id in posts Table
     * @return {Upvote | undefined} - found Upvote
     */
    static async deleteOne(userId, postId) {
        // first fetch the upvote from the DB
        // and then delete it from the DB, waiting for completion
        return Upvotes.findOne(userId, postId)
            .then( (upvote) => {
                db.run(`DELETE FROM upvotes WHERE ${db.columnNames.upvoteTableUserId} = '${userId}' AND ${db.columnNames.upvoteTablePostId} = '${postId}'`);
                return upvote;
            });
    }

    /**
     * Find a Upvote List by User Id.
     *
     * @param {integer} userId - User Id in users Table
     * @return {Upvote[]} - found Upvotes
     */
    static async findByUserId(userId) {
        return db.all(`SELECT * FROM upvotes WHERE ${db.columnNames.upvoteTableUserId} = '${userId}'`);
    }

    /**
     * Find a Upvote List by Post Id.
     *
     * @param {integer} postId - Post Id in posts Table
     * @return {Upvote[]} - found Upvotes
     */
    static async findByPostId(postId) {
        return db.all(`SELECT * FROM upvotes WHERE ${db.columnNames.upvoteTablePostId} = '${postId}'`);
    }


    /**
     * Return an array of all of the Upvotes.
     *
     * @return {Upvote[]}
     */
    static async findAll() {
        return db.all(`SELECT * FROM upvotes`);
    }

}

module.exports = Upvotes;