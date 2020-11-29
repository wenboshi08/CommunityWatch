const express = require('express');

const Users = require('../models/Users');
const Neighborhoods = require('../models/Neighborhoods');
const v = require('./validators');
const Feeds = require('../models/Feeds');

const router = express.Router();

/**
 * create a feed
 * @name POST /api/feeds
 * @throws {400}
 */
router.post(
    '/',
    [
        v.ensureUserLoggedIn,
        v.ensureValidNeighborhoodIdInBody,
    ],
    async (req, res) => {
        try {
            // middleware will make sure that there is a
            // valid user logged in, and non-empty and valid neighborhood id!
            const loggedInUserId = req.session.uid;
            const neighborhoodId = parseInt(req.body.neighborhoodId);

            const neighborhood = await Neighborhoods.findOneById(neighborhoodId);
            if (!neighborhood) {
                res.status(404).json({
                    error: `Neighborhood with id ${neighborhoodId} does not exist`,
                }).end();
                return;
            }

            const existingFeed = await Feeds.findOne(loggedInUserId, neighborhoodId);
            if (existingFeed) {
                res.status(404).json({
                    error: `User with id ${loggedInUserId} already subscribed neighborhood id ${neighborhoodId}`,
                }).end();
                return;
            }
            // issue a request to add this feed to our DB
            const feed = await Feeds.addOne(loggedInUserId, neighborhoodId);
            res.status(201).json(feed).end();

        } catch (error) {
            res.status(503).json({ error: `Could not add the feed: ${error}` }).end();
        }
    }
);



/**
 * Delete a feed.
 * @name DELETE /api/feeds/neighborhood/:neighborhoodId
 * @throws {400}
 */

router.delete(
    '/neighborhood/:neighborhoodId?',
    [
        v.ensureUserLoggedIn,
        v.ensureValidNeighborhoodIdInParams,
    ],
    async (req, res) => {
        try {
            // middleware will ensure that a valid user is logged in
            // and will check that the neighborhood id is non-empty
            const loggedInUserId = req.session.uid;
            const neighborhoodId = parseInt(req.params.neighborhoodId);
            // ensure that the given feed exists in our DB
            const feed = await Feeds.findOne(loggedInUserId, neighborhoodId);
            if (!feed) {
                res.status(404).json({
                    error: `Feed with userid ${loggedInUserId} and neighborhood id ${neighborhoodId} does not exist`,
                }).end();
                return;
            }
            // issue an delete request for the feed in our DB
            const deletedFeed = await Feeds.deleteOne(loggedInUserId, neighborhoodId);
            res.status(200).json(deletedFeed).end();

        } catch (error) {
            res.status(503).json({ error: `Could not delete the Feed: ${error}` }).end();
        }
    }
);

/**
 * GET ALL feeds of a userid
 * @name GET /api/feeds/user/:userid
 * return a list feeds belong to the user
 * @throws {400}
 */
router.get(
    '/user/:userid?',
    [
        v.ensureValidUserIdInParams,
    ],
    async (req, res) => {
        try {
            // middleware will make sure that there is a valid user id!
            const userId = parseInt(req.params.userid);
            const feeds = await Feeds.findByUserId(userId);
            res.status(200).json(feeds).end();
        } catch (error) {
            res.status(503).json({ error: `Could not find the feed: ${error}` }).end();
        }
    }
);

/**
 * GET ALL feeds of a neighborhood Id
 * @name GET /api/feeds/neighborhood/:neighborhoodId
 * return a list feeds belong to a neighborhood
 * @throws {400}
 */
router.get(
    '/neighborhood/:neighborhoodId?',
    [
        v.ensureValidNeighborhoodIdInParams,
    ],
    async (req, res) => {
        try {
            // middleware will make sure that there is a non-empty neighborhood id!
            const neighborhoodId = parseInt(req.params.neighborhoodId);
            const feeds = await Feeds.findByNeighborhoodId(neighborhoodId);
            res.status(200).json(feeds).end();
        } catch (error) {
            res.status(503).json({ error: `Could not find the feed: ${error}` }).end();
        }
    }
);


/**
 * GET ALL feeds in the database
 * @name GET /api/feeds
 * return a list feeds
 * @throws {400}
 */
router.get(
    '/',
    [],
    async (req, res) => {
        try {
            const feeds = await Feeds.findAll();
            res.status(200).json(feeds).end();
        } catch (error) {
            res.status(503).json({ error: `Could not find the feed: ${error}` }).end();
        }
    }
);


module.exports = router;





