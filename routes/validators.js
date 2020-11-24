const express = require('express');

const Neighborhoods = require('../models/Neighborhoods');
const Users = require('../models/Users');


// const Shorts = require('../models/Shorts');
// const Users = require('../models/Users');

// ------------------------------ AUTH

// const ensureUserNotLoggedIn = function(req, res, next) {
//   if (req.session.uid) {
//     res.status(400).json({ error: "You are signed in!" }).end();
//     return;
//   }
//   next();
// };

// const ensureUserLoggedIn = function(req, res, next) {
//   if (!req.session.uid) {
//     res.status(401).json({ error: "Must be signed in!" }).end();
//     return;
//   }
//   next();
// };

// // ------------------------------ BODY

// const ensureValidUsernameInBody = function(req, res, next) {
//   if (!req.body.username) {
//     res.status(400).json({ error: "You must specify a valid username in the body" }).end();
//     return;
//   }
//   next();
// };


// const ensureValidShortUrlInBody = function(req, res, next) {
//   if (!req.body.url) {
//     res.status(400).json({ error: "You must specify a valid short URL in the body" }).end();
//     return;
//   }
//   next();
// };

// // ------------------------------ AUTH

// const ensureValidShortNameParam = function(req, res, next) {
//   if (!req.params.name) {
//     res.status(400).json({ error: "You must specify the name of a short as a parameter" }).end();
//     return;
//   }
//   next();
// };


const ensureValidNeighborhoodIdInBody = function(req, res, next) {
  if (!req.body.neighborhoodId) {
    res.status(400).json({ error: "You must specify a valid neighborhood id in the body" }).end();
    return;
  }
  next();
};



// ------------------------------ AUTH

const ensureUserNotLoggedIn = function(req, res, next) {
  console.log(`${req.session.uid}`);
  if (req.session.uid) {
    res.status(400).json({ error: "You are signed in!" }).end();
    return;
  }
  next();
};

const ensureUserLoggedIn = function(req, res, next) {
  if (!req.session.uid) {
    res.status(401).json({ error: "Must be signed in!" }).end();
    return;
  }
  next();
};

// ------------------------------ BODY

const ensureValidUsernameInBody = function(req, res, next) {
  if (!req.body.username) {
    res.status(400).json({ error: "You must specify a valid username in the body" }).end();
    return;
  }
  next();
};

const ensureValidPasswordInBody = function(req, res, next) {
  if (!req.body.password) {
    res.status(400).json({ error: "You must specify a valid password in the body" }).end();
    return;
  }
  next();
};

// ------------------------------ Params
const ensureValidNeighborhoodIdInParams = function(req, res, next) {
  if (!req.params.neighborhoodid) {
    res.status(400).json({ error: "You must specify a valid neighborhoodId in the params" }).end();
    return;
  }
  next();
};

const ensureValidUserIdInParams = function(req, res, next) {
  if (!req.params.userid) {
    res.status(400).json({ error: "You must specify a valid userId in the params" }).end();
    return;
  }
  next();
};

// ------------------------------ AUTH




module.exports = {
  ensureValidNeighborhoodIdInBody,
  ensureUserNotLoggedIn,
  ensureUserLoggedIn,
  ensureValidUsernameInBody,
  ensureValidPasswordInBody,
  ensureValidNeighborhoodIdInParams,
  ensureValidUserIdInParams,

};


