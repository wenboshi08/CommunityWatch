const express = require('express');

const Replies = require('../models/Replies');
const Users = require('../models/Users'); 
const v = require('./validators');
const router = express.Router();


/**
 * Get all replies per post.
 * 
 * @name GET /api/replies/:postId
 * @return {Replies[]} - list of replies
 */
router.get(
  '/:postId?', 
  [],
  async (req, res) => {
  try {    
    // fetch replies for post from our DB
    let postId = req.params.postId; 
    let allReplies = await Replies.findRepliesByPostId(postId);

    let resolvePromise = async (reply) => {
      let replier = await Users.getFromID(reply.userId); 
      return ({
        replyId: reply.id, 
        replierId: reply.userId, 
        replier: replier.name,
        replyContent: reply.content, 
        postId: reply.postId, 
      });
    }

    let promises = allReplies.map((reply) => {
      return resolvePromise(reply); 
    }); 
    Promise.all(promises).then((results) => {
      res.status(200).json(results).end();
    })
  } catch (error) {
    res.status(503).json({ error: `Could not fetch replies: ${error}` }).end();
  }
});

/*
  Creates a new reply, must be signed in
 */
router.post(
  "/new",
  [v.ensureUserLoggedIn],
  async (req, res) => {
    const loggedInUserId = req.session.uid
    // let userInfo = await Users.getFromID(loggedInUserId); 
    // let user = userInfo.userName;
    let content = req.body.content;
    let postId = req.body.postId; 
    let reply = await Replies.createReply(loggedInUserId, content, postId);
    res
      .status(201)
      .send(reply)
      .end();
  }
);


/*
 Delete a reply, must be signed in as the user who posted
 */
router.delete(
  "/:replyId?",
  [
    v.ensureUserLoggedIn,
    v.ensureValidReplyIdInParams,
    v.ensureRepliedByUser,
  ],
  async (req, res) => {
    let id = parseInt(req.params.replyId, 10);
    await Replies.deleteReply(id);
    res
      .status(200)
      .json({
        success: `Reply ${id} deleted forever.`
      })
      .end();
  }
);


module.exports = router;