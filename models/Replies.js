const db = require('../db/db_config');

/**
 * @typeof Replies
 * 
 * @prop {integer} replyId          - unique reply id number 
 * @prop {integer} userId           - id of user who is posting 
 * @prop {integer} postId           - postId for which reply appears under
 * @prop {string} content           - content of the reply, as string
 */

/**
 * @class Replies
 * 
 * Stores all replies.
 */
class Replies {
 
  /**
   * Find a Reply type by its id.
   * 
   * @param {Integer} replyId - id of reply to find
   * @return {Replies[] | undefined}
   */
  static async findReplyById(replyId) {
    return db.get(`SELECT * FROM replies WHERE ${db.columnNames.replyTableReplyId} == ${replyId}`);
  }

  /**
   * Find all replies corresponding to a particular post
   * @param {Integer} postId  
   * @return {Replies[] | undefined}
   */
  static async findRepliesByPostId(postId) {
    return db.all(`SELECT * FROM replies WHERE ${db.columnNames.replyTablePostId} == ${postId} ORDER BY id ASC`);
  }

  /**
   * Find Replies by user id
   * 
   * @param {Integer} userId - id of user to find
   * @return {Replies[]}
   */
  static async getRepliesByUser(userId) {
    return db.all(`SELECT * FROM replies WHERE ${db.columnNames.replyTableUserId} == ${userId}`); 
  }

  /**
   * Create a reply 
   * 
   * @param {Integer} userId
   * @param {String} content
   * @param {Integer} postId - id of post that user is replying to 
   */
  static async createReply(userId, content, postId) {
    return db
      .run(
        `INSERT INTO replies (${db.columnNames.replyTableUserId}, ${db.columnNames.replyTableReplyContent}, ${db.columnNames.replyTablePostId})
            VALUES (${userId}, "${content}", ${postId})`
      )
      .then(() =>
        db.get(`SELECT ${db.columnNames.replyTableReplyContent}, ${db.columnNames.replyTableReplyId} FROM replies 
                                WHERE ${db.columnNames.replyTableReplyId} = 
                                (SELECT MAX(${db.columnNames.replyTableReplyId}) from replies)`)
      );
  }

  /**
   * Delete a reply 
   * 
   * @param {Integer} replyId
   */
  static async deleteReply(replyId) {
    return Replies.findReplyById(replyId).then(reply => {
      db.run(
        `DELETE FROM replies WHERE ${db.columnNames.replyTableReplyId} == ${replyId}`
      );
      return reply;
    });
  }

}

module.exports = Replies;
