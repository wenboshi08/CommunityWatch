const express = require('express');

const Posts = require('../models/Posts');
const v = require('./validators');
const Downvotes = require('../models/Downvotes');

const router = express.Router();

/**
 * create a downvote
 * @name POST /api/downvotes
 * @throws {400}
 */
router.post(
    '/',
    [
        v.ensureValidUserIdInBody,
        v.ensureValidPostIdInBody,
    ],
    async (req, res) => {
        try {
            const loggedInUserId = parseInt(req.body.userId);
            const postId = parseInt(req.body.postId);

            const post = await Posts.findPostById(postId);
            if (!post) {
                res.status(404).json({
                    error: `Post with id ${postId} does not exist`,
                }).end();
                return;
            }

            const existingDownvote = await Downvotes.findOne(loggedInUserId, postId);
            if (existingDownvote) {
                res.status(404).json({
                    error: `User with id ${loggedInUserId} already downvote post id ${postId}`,
                }).end();
                return;
            }
            // issue a request to add this downvote to our DB
            const downvote = await Downvotes.addOne(loggedInUserId, postId);
            res.status(201).json(downvote).end();

        } catch (error) {
            res.status(503).json({ error: `Could not add the downvote: ${error}` }).end();
        }
    }
);



/**
 * Remove a downvote.
 * @name PUT /api/downvotes
 * @throws {400}
 */

router.put(
    '/',
    [
        v.ensureValidUserIdInBody,
        v.ensureValidPostIdInBody,
    ],
    async (req, res) => {
        try {
            const loggedInUserId = parseInt(req.body.userId);
            const postId = parseInt(req.body.postId);
            // ensure that the given downvote exists in our DB
            const downvote = await Downvotes.findOne(loggedInUserId, postId);
            if (!downvote) {
                res.status(404).json({
                    error: `Downvote with userid ${loggedInUserId} and post id ${postId} does not exist`,
                }).end();
                return;
            }
            // issue an delete request for the downvote in our DB
            const deletedDownvote = await Downvotes.deleteOne(loggedInUserId, postId);
            res.status(200).json(deletedDownvote).end();

        } catch (error) {
            res.status(503).json({ error: `Could not delete the Downvote: ${error}` }).end();
        }
    }
);

/**
 * GET ALL downvotes of a userid
 * @name GET /api/downvotes/user
 * return a list downvotes belong to the user
 * @throws {503}
 */
router.get(
    '/user', [],
    async (req, res) => {
        try {
            const userId = parseInt(req.query.id);
            const downvotes = await Downvotes.findByUserId(userId);
            res.status(200).json(downvotes).end();
        } catch (error) {
            res.status(503).json({ error: `Could not find the downvote: ${error}` }).end();
        }
    }
);

/**
 * GET ALL downvotes of a post Id
 * @name GET /api/downvotes/post/:postId
 * return a list downvotes belong to a post
 * @throws {400}
 */
router.get(
    '/post/:postId?',
    [
        v.ensureValidPostIdInParams,
    ],
    async (req, res) => {
        try {
            const postId = parseInt(req.params.postId);
            const downvotes = await Downvotes.findByPostId(postId);
            res.status(200).json(downvotes).end();
        } catch (error) {
            res.status(503).json({ error: `Could not find the downvote: ${error}` }).end();
        }
    }
);


/**
 * GET ALL downvotes in the database
 * @name GET /api/downvotes
 * return a list downvotes
 * @throws {400}
 */
router.get(
    '/',
    [],
    async (req, res) => {
        try {
            const downvotes = await Downvotes.findAll();
            res.status(200).json(downvotes).end();
        } catch (error) {
            res.status(503).json({ error: `Could not find the downvote: ${error}` }).end();
        }
    }
);


module.exports = router;