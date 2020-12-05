const express = require('express');

const Posts = require('../models/Posts');
const v = require('./validators');
const Upvotes = require('../models/Upvotes');

const router = express.Router();

/**
 * create a upvote
 * @name POST /api/upvotes
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

            const existingUpvote = await Upvotes.findOne(loggedInUserId, postId);
            if (existingUpvote) {
                res.status(404).json({
                    error: `User with id ${loggedInUserId} already upvote post id ${postId}`,
                }).end();
                return;
            }
            // issue a request to add this upvote to our DB
            const upvote = await Upvotes.addOne(loggedInUserId, postId);
            res.status(201).json(upvote).end();

        } catch (error) {
            res.status(503).json({ error: `Could not add the upvote: ${error}` }).end();
        }
    }
);



/**
 * Remove a upvote.
 * @name PUT /api/upvotes
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
            // ensure that the given upvote exists in our DB
            const upvote = await Upvotes.findOne(loggedInUserId, postId);
            if (!upvote) {
                res.status(404).json({
                    error: `Upvote with userid ${loggedInUserId} and post id ${postId} does not exist`,
                }).end();
                return;
            }
            // issue an delete request for the upvote in our DB
            const deletedUpvote = await Upvotes.deleteOne(loggedInUserId, postId);
            res.status(200).json(deletedUpvote).end();

        } catch (error) {
            res.status(503).json({ error: `Could not delete the Upvote: ${error}` }).end();
        }
    }
);

/**
 * GET ALL upvotes of a userid
 * @name GET /api/upvotes/user
 * return a list upvotes belong to the user
 * @throws {503}
 */
router.get(
    '/user', [],
    async (req, res) => {
        try {
            const userId = parseInt(req.query.id);
            const upvotes = await Upvotes.findByUserId(userId);
            res.status(200).json(upvotes).end();
        } catch (error) {
            res.status(503).json({ error: `Could not find the upvote: ${error}` }).end();
        }
    }
);

/**
 * GET ALL upvotes of a post Id
 * @name GET /api/upvotes/post/:postId
 * return a list upvotes belong to a post
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
            const upvotes = await Upvotes.findByPostId(postId);
            res.status(200).json(upvotes).end();
        } catch (error) {
            res.status(503).json({ error: `Could not find the upvote: ${error}` }).end();
        }
    }
);


/**
 * GET ALL upvotes in the database
 * @name GET /api/upvotes
 * return a list upvotes
 * @throws {400}
 */
router.get(
    '/',
    [],
    async (req, res) => {
        try {
            const upvotes = await Upvotes.findAll();
            res.status(200).json(upvotes).end();
        } catch (error) {
            res.status(503).json({ error: `Could not find the upvote: ${error}` }).end();
        }
    }
);


module.exports = router;