const express = require('express');

const Posts = require('../models/Posts');
const Users = require('../models/Users'); 
const Neighborhoods = require('../models/Neighborhoods');
const v = require('./validators');
const router = express.Router();


/**
 * List all posts.
 * 
 * @name GET /api/posts
 * @return {Posts[]} - list of all posts
 */
router.get(
  '/', 
  [],
  async (req, res) => {
  try {    
    // fetch all the posts from our DB
    let neighborhoodId = req.query.neighborhoodId;
    let allPosts = await Posts.getAllPosts(neighborhoodId);

    let resolvePromise = async (post) => {
      let poster = await Users.getFromID(post.userId); 
      let neighborhood = await Neighborhoods.findOneById(post.neighborhoodId); 
      return ({
        postId: post.id, 
        posterId: post.userId, 
        poster: poster.name,
        postContent: post.content, 
        neighborhoodId: post.neighborhoodId, 
        neighborhood: neighborhood.neighborhood, 
      });
    }

    let promises = allPosts.map((post) => {
      return resolvePromise(post); 
    }); 
    Promise.all(promises).then((results) => {
      res.status(200).json(results).end();
    })
  } catch (error) {
    res.status(503).json({ error: `Could not fetch all posts: ${error}` }).end();
  }
});

// /**
//  * List all posts by neighborhoods.
//  * 
//  * @name GET /api/posts/neighborhood/neighborhoodId
//  * @return {Posts[]} - list of posts
//  */
// router.get(
//   '/neighborhood/:neighborhoodId', 
//   [v.ensureValidNeighborhoodIdInParams],
//   async (req, res) => {
//   try {
//     let neighborhoodId = parseInt(req.params.neighborhoodId, 10);
//     const posts = await Posts.findPostByNeighborhoodId(neighborhoodId);
//     res.status(200).json(posts).end();

//   } catch (error) {
//     res.status(503).json({ error: `Could not fetch posts by neighborhood ${neighborhoodId}: ${error}` }).end();
//   }
// });

/*
  Creates a new post, must be signed in
 */
router.post(
  "/new",
  [v.ensureUserLoggedIn],
  async (req, res) => {
    const loggedInUserId = req.session.uid
    // let userInfo = await Users.getFromID(loggedInUserId); 
    // let user = userInfo.userName;
    let content = req.body.content;
    let neighborhoodId = req.body.neighborhoodId; 
    let post = await Posts.createPost(loggedInUserId, content, neighborhoodId);
    res
      .status(201)
      .send(post)
      .end();
  }
);

/*
 Edit a post, must be signed in as the user who posted
 */
router.patch(
  "/:postId?",
  [
    v.ensureUserLoggedIn,
    v.ensureValidPostIdInParams,
    v.ensurePostedByUser,
  ],
  async (req, res) => {
    let id = parseInt(req.params.postId, 10);
    let content = req.body.content;
    let neighborhoodId = req.body.neighborhoodId; 
    let post = await Posts.editPost(id, content, neighborhoodId);
    res
      .status(200)
      .json(post)
      .end();
  }
);



/*
 Get a flag, must be signed in 
 */
router.get(
  "/flag/:postId?",
  [
    v.ensureUserLoggedIn,
    v.ensureValidPostIdInParams,
  ],
  async (req, res) => {
    const loggedInUserId = req.session.uid
    let id = parseInt(req.params.postId, 10);
    let flagged = await Posts.getFlag(loggedInUserId, id);
    res
      .status(200)
      .json({
        success: `Post ${id} retrieved.`,
        flagged : flagged,
      })
      .end();
  }
);


/*
 Get all flags, must be signed in 
 */
router.get(
  "/flag/all/:postId?",
  [
    v.ensureValidPostIdInParams,
  ],
  async (req, res) => {
    let id = parseInt(req.params.postId, 10);
    let flagged = await Posts.getAllFlags(id);
    res
      .status(200)
      .json({
        success: `Post ${id} retrieved.`,
        flagged : flagged,
      })
      .end();
  }
);

/*
 Flag a post, must be signed in 
 */
router.put(
  "/flag/:postId?",
  [
    v.ensureUserLoggedIn,
    v.ensureValidPostIdInParams,
  ],
  async (req, res) => {
    const loggedInUserId = req.session.uid
    let id = parseInt(req.params.postId, 10);
    let flagged = await Posts.toggleFlag(loggedInUserId, id);
    res
      .status(200)
      .json({
        success: `Post ${id} flagged.`,
        flagged : flagged,
      })
      .end();
  }
);

/*
 Delete a post, must be signed in as the user who posted
 */
router.delete(
  "/:postId?",
  [
    v.ensureUserLoggedIn,
    v.ensureValidPostIdInParams,
    v.ensurePostedByUser,
  ],
  async (req, res) => {
    let id = parseInt(req.params.postId, 10);
    await Posts.deletePost(id);
    res
      .status(200)
      .json({
        success: `Post ${id} deleted forever.`
      })
      .end();
  }
);


module.exports = router;