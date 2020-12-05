const db = require('../db/db_config');

/**
 * @typeof Downvote
 *
 * @prop {integer} userId           - user id
 * @prop {integer} postId   - post id
 *
 */

/**
 * @class Downvotes
 *
 * Stores all downvotes.
 */

class Downvotes {
    /**
     * Add a Downvote.
     *
     * @param {integer} userId - User Id in users Table
     * @param {integer} postId - Post Id in posts Table
     * @return {Downvote} - created downvote
     */
    static async addOne(userId, postId) {
        // first insert the downvote into the DB and wait for completion
        // and then fetch the new downvote from the DB
        return db.run(`INSERT INTO downvotes (${db.columnNames.downvoteTableUserId}, ${db.columnNames.downvoteTablePostId}) VALUES ('${userId}', '${postId}')`)
            .then(() => {
                return Downvotes.findOne(userId, postId);
            });
    }

    /**
     * Find a Downvote by User Id and Post Id.
     *
     * @param {integer} userId - User Id in users Table
     * @param {integer} postId - Post Id in posts Table
     * @return {Downvote | undefined} - found Downvote
     */
    static async findOne(userId, postId) {
        return db.get(`SELECT * FROM downvotes WHERE ${db.columnNames.downvoteTableUserId} = '${userId}' AND ${db.columnNames.downvoteTablePostId} = '${postId}'`);
    }

    /**
     * Delete a Downvote.
     *
     * @param {integer} userId - User Id in users Table
     * @param {integer} postId - Post Id in posts Table
     * @return {Downvote | undefined} - found Downvote
     */
    static async deleteOne(userId, postId) {
        // first fetch the downvote from the DB
        // and then delete it from the DB, waiting for completion
        return Downvotes.findOne(userId, postId)
            .then( (downvote) => {
                db.run(`DELETE FROM downvotes WHERE ${db.columnNames.downvoteTableUserId} = '${userId}' AND ${db.columnNames.downvoteTablePostId} = '${postId}'`);
                return downvote;
            });
    }

    /**
     * Find a Downvote List by User Id.
     *
     * @param {integer} userId - User Id in users Table
     * @return {Downvote[]} - found Downvotes
     */
    static async findByUserId(userId) {
        return db.all(`SELECT * FROM downvotes WHERE ${db.columnNames.downvoteTableUserId} = '${userId}'`);
    }

    /**
     * Find a Downvote List by Post Id.
     *
     * @param {integer} postId - Post Id in posts Table
     * @return {Downvote[]} - found Downvotes
     */
    static async findByPostId(postId) {
        return db.all(`SELECT * FROM downvotes WHERE ${db.columnNames.downvoteTablePostId} = '${postId}'`);
    }


    /**
     * Return an array of all of the Downvotes.
     *
     * @return {Downvote[]}
     */
    static async findAll() {
        return db.all(`SELECT * FROM downvotes`);
    }

}

module.exports = Downvotes;