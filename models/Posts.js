const db = require('../db/db_config');

/**
 * @typeof Posts
 * 
 * @prop {integer} postId           - unique post id number 
 * @prop {integer} userId           - id of user who is posting 
 * @prop {integer} neighborhoodId   - neighborhoodId id
 * @prop {string} content           - content of the post, as string
 */

/**
 * @class Posts
 * 
 * Stores all posts.
 */
class Posts {
 
  /**
   * Find a Post type by its id.
   * 
   * @param {Integer} postId - id of post to find
   * @return {Posts[] | undefined}
   */
  static async findPostById(postId) {
    return db.get(`SELECT * FROM posts WHERE ${db.columnNames.postTablePostId} == ${postId}`);
  }

  /**
   * Return an array of all of the posts.
   * 
   * @return {Posts[]}
   */
  static async getAllPosts(neighborhoodId) {
    if(neighborhoodId === undefined || neighborhoodId === "0") {
      return db.all(`SELECT * FROM posts ORDER BY id DESC LIMIT 20`);
    } else {
      return db.all(`SELECT * FROM posts WHERE ${db.columnNames.postTableNeighborhoodId} = '${neighborhoodId}' ORDER BY id DESC LIMIT 20`);
    }
  }

  /**
   * Find Posts by user id
   * 
   * @param {Integer} userId - id of user to find
   * @return {Posts[]}
   */
  static async getPostsByUser(userId) {
    return db.get(`SELECT * FROM posts WHERE ${db.columnNames.postTableUserId} == ${userId}`); 
  }

  /**
   * Find Posts by neighborhoods
   * 
   * @param {Integer[]} neighborhoodIds - id of neighborhoods to find
   * @return {Posts[]}
   */
  static async getPostsByNeighborhoods(neighborhoodIds) {
    return db.get(`SELECT * FROM posts WHERE neighborhoodId in ('${neighborhoodIds.join()}')`); 
  }

   /**
   * Find posts corresponding to a specific neighborhood.
   * 
   * @param {Integer} neighborhoodId - id of neighborhood to filter by
   * @return {Posts[] | undefined}
   */
  static async findPostByNeighborhoodId(neighborhoodId) {
    return db.all(`SELECT * FROM posts WHERE ${db.columnNames.postTableNeighborhoodId} == ${neighborhoodId} ORDER BY id DESC`);
  }

  /**
   * Create a post 
   * 
   * @param {Integer} userId
   * @param {String} content
   * @param {Integer} neighborhoodId - id of neighborhood
   */
  static async createPost(userId, content, neighborhoodId) {
    return db
      .run(
        `INSERT INTO posts (${db.columnNames.postTableUserId}, ${db.columnNames.postTablePostContent}, ${db.columnNames.postTableNeighborhoodId})
            VALUES (${userId}, "${content}", ${neighborhoodId})`
      )
      .then(() =>
        db.get(`SELECT ${db.columnNames.postTablePostContent}, ${db.columnNames.postTablePostId} FROM posts 
                                WHERE ${db.columnNames.postTablePostId} = 
                                (SELECT MAX(${db.columnNames.postTablePostId}) from posts)`)
      );
  }

  /**
   * Edit a post 
   * 
   * @param {Integer} postId
   * @param {String} content
   * @param {Integer} neighborhoodId - id of neighborhood
   */
  static async editPost(postId, content, neighborhoodId) {
    return db
      .run(
        `UPDATE posts
            SET ${db.columnNames.postTablePostContent} = "${content}",
                ${db.columnNames.postTableNeighborhoodId} = ${neighborhoodId}, 
            WHERE ${db.columnNames.postTablePostId} == ${postId}`
      )
      .then(() => {
        return Posts.findPostById(postId);
      });
  }

  /**
   * Delete a post 
   * 
   * @param {Integer} postId
   */
  static async deletePost(postId) {
    return Posts.findPostById(postId).then(post => {
      db.run(
        `DELETE FROM posts WHERE ${db.columnNames.postTablePostId} == ${postId}`
      );
      return post;
    });
  }

    /**
   * Get a flag for user if any 
   * 
   * @param {Integer} userId
   * @param {Integer} postId
   */
  static async getFlag(userId, postId) {
    let result = await db.get(`SELECT * FROM flags WHERE ${db.columnNames.flagTableUserId} == ${userId} AND ${db.columnNames.flagTablePostId} == ${postId}`);
    return result;
 
  }


    /**
   * Get all flags for a post
   * 
   * @param {Integer} userId
   * @param {Integer} postId
   */
  static async getAllFlags(postId) {
    let result = await db.get(`SELECT * FROM flags WHERE ${db.columnNames.flagTablePostId} == ${postId}`);
    return result;
 
  }

  /**
   * Toggle Flag by its userid and postid.
   * 
   * @param {Integer} postId - id of post
   * @param {Integer} userId - id of user
   * @return {boolean | undefined}
   */
  static async toggleFlag(userId, postId)
  {
    let result = await db.get(`SELECT * FROM flags WHERE ${db.columnNames.flagTableUserId} == ${userId} AND ${db.columnNames.flagTablePostId} == ${postId}`);
    
    if (result == undefined)
    {
      return Posts.findPostById(postId).then(post =>
      {
        db.run(
          `INSERT INTO flags (${db.columnNames.flagTableUserId}, ${db.columnNames.flagTablePostId})
            VALUES (${userId}, "${postId}")`
        );
        return true;
      });

    }
    else
    {

      return Posts.findPostById(postId).then(post =>
      {
        db.run(
          `DELETE FROM flags WHERE ${db.columnNames.flagTablePostId} == ${postId} AND ${db.columnNames.flagTableUserId} == ${userId}`
        );
        return false;
      });
    }
  }

  //  /**
  //  * Flag a post 
  //  * 
  //  * @param {Integer} postId
  //  */
  // static async flagPost(userId, postId) {
  //   return Posts.findPostById(postId).then(post => {
  //     db.run(
  //       `INSERT INTO flags (${db.columnNames.flagTableUserId}, ${db.columnNames.flagTablePostId})
  //           VALUES (${userId}, "${postId}")`
  //     );
  //     return post;
  //   });
  // }

  // *
  //  * Remove a Flag from post 
  //  * @param {Integer} userId
  //  * @param {Integer} postId
   
  // static async deleteFlag(userId, postId) {
  //   return Posts.findPostById(postId).then(post => {
  //     db.run(
  //       `DELETE FROM flags WHERE ${db.columnNames.postTablePostId} == ${postId} AND ${db.columnNames.postTableUserId} == ${userId}`
  //     );
  //     return post;
  //   });
  // }


}

module.exports = Posts;
