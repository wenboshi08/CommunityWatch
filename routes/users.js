const express = require('express');

const Users = require('../models/Users');
const v = require('./validators');

const router = express.Router();

/**
 * Get all users.
 * 
 * @name GET /api/users
 */
router.get(
  '/', 
  [],
  async (req, res) => {
  try {
    // fetch all user from the DB
    let users = await Users.findAll();
    console.log(users.map(user => user.name))
    res.status(200).json({"all" : users}).end();

  } catch (error) {
    res.status(503).json({ error: "Could not fetch users" }).end();
  }
});

/**
 * Get a particular user.
 * 
 * @name GET /api/users/:username
 */
router.get(
  '/:username', 
  [],
  async (req, res) => {
  try {
    // fetch all user from the DB
    username = req.params.username;
    console.log(`Username queried: ${username}`);
    let user = await Users.get(username);
    res.status(200).json({"user" : user}).end();
    console.log(user);

  } catch (error) {
    res.status(503).json({ error: "Could not fetch user" }).end();
  }
});

/**
 * Create new user.
 * 
 * @name POST /api/users
 */
router.post(
  '/',
  [v.ensureValidUsernameInBody,
   v.ensureValidPasswordInBody],
  async (req, res) => {
  try {
    // middleware will ensure that this statement below is nonempty!
    const username = req.body.username;
    const password = req.body.password;
    console.log("GOT HERE:");

    // issue a call to the DB to create a new user with the given username
    let user = await Users.addOne(username, password);
    res.status(201).json({ user, message: "Please sign in to continue." }).end();
    
  } catch (error) {
    res.status(400).json({ error: "Username must be unique and non-empty, and password must be non-empty" }).end();
  }
});



/**
 * Delete a user.
 * 
 * @name DELETE /api/users
 */
router.delete(
  '/',
  [v.ensureUserLoggedIn
  ],
  async (req, res) => {
  try {
    const loggedInUserId = req.session.uid;
    console.log(`User to be deleted ${loggedInUserId}`);
    let user = await Users.deleteUser(loggedInUserId);
    res.status(201).json({ user, message: "User deleted" }).end();
    
  } catch (error) {
    res.status(400).json({ error: "Could not remove user" }).end();
  }
});

/**
 * Update user credentials
 * 
 * @name PUT /api/users
 */
router.put(
  '/',
  [
  v.ensureUserLoggedIn,
  v.ensureValidUsernameInBody
  ],
  async (req, res) => {
  try {
    const loggedInUserId = req.session.uid;

    // middleware will ensure that this statement below is nonempty!
    const username = req.body.username;

    let user = await Users.updateUserName(loggedInUserId, username);
    res.status(201).json({ user, message: "Username updated successfullly" }).end();
    
  } catch (error) {
    res.status(400).json({ error: error.message }).end();
  }
});

/**
 * Update user credentials
 * 
 * @name PUT /api/users/password
 */
router.put(
  '/password',
  [
  v.ensureUserLoggedIn,
  v.ensureValidPasswordInBody
  ],
  async (req, res) => {
  try {
    const loggedInUserId = req.session.uid;

    // middleware will ensure that this statement below is nonempty!
    const password = req.body.password;

    let user = await Users.updatePassword(loggedInUserId, password);
    res.status(201).json({ user, message: "Password updated successfullly" }).end();
    
  } catch (error) {
    res.status(400).json({ error: "error.message" }).end();
  }
});




module.exports = router;