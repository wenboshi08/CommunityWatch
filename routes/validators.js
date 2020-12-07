const express = require('express');

const Neighborhoods = require('../models/Neighborhoods');
const Users = require('../models/Users');
const Posts = require('../models/Posts');
const Replies = require('../models/Replies');


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
  console.log(`${req.session}`);
  if (req.session.uid) {
    res.status(400).json({ error: "You are signed in!" }).end();
    return;
  }
  next();
};

const ensureUserLoggedIn = function(req, res, next) {
  console.log(` ensure logged in - uid: ${req.session.uid}`);
  console.log(req.session);

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

const ensureValidUserIdInBody = function(req, res, next) {
  if (!req.body.userId) {
    res.status(400).json({ error: "You must specify a valid user Id in the body" }).end();
    return;
  }
  next();
};


const ensureValidPostIdInBody = function(req, res, next) {
  if (!req.body.postId) {
    res.status(400).json({ error: "You must specify a valid post Id in the body" }).end();
    return;
  }
  next();
};


// ------------------------------ Params
const ensureValidNeighborhoodIdInParams = function(req, res, next) {
  if (!req.params.neighborhoodId) {
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

const ensureValidPostIdInParams = function(req, res, next) {
  if (!req.params.postId) {
    res.status(400).json({ error: "You must specify a valid postId in the params" }).end();
    return;
  }
  next();
};

const ensureValidReplyIdInParams = function(req, res, next) {
  if (!req.params.replyId) {
    res.status(400).json({ error: "You must specify a valid replyId in the params" }).end();
    return;
  }
  next();
};

// ------------------------------ AUTH
const ensurePostedByUser = async function(req, res, next) {
  let id = req.params.postId ? req.params.postId : req.body.id;
  let post = await Posts.findPostById(parseInt(id, 10));
  let poster = post.userId; 
  let loggedInUserId = req.session.uid; 
  if (poster !== loggedInUserId) {
    res
      .status(401)
      .json({
        error: "Unauthorized. Can't modify or delete a post you didn't create."
      })
      .end();
  } else {
    next(); 
  }
};

const ensureRepliedByUser = async function(req, res, next) {
  let id = req.params.replyId ? req.params.replyId : req.body.id;
  let reply = await Replies.findReplyById(parseInt(id, 10));
  let replier = reply.userId; 
  let loggedInUserId = req.session.uid; 
  if (replier !== loggedInUserId) {
    res
      .status(401)
      .json({
        error: "Unauthorized. Can't modify or delete a reply you didn't create."
      })
      .end();
  } else {
    next(); 
  }
};



module.exports = {
  ensureValidNeighborhoodIdInBody,
  ensureUserNotLoggedIn,
  ensureUserLoggedIn,
  ensureValidUsernameInBody,
  ensureValidPasswordInBody,
  ensureValidNeighborhoodIdInParams,
  ensureValidUserIdInParams,
  ensureValidPostIdInParams,
  ensureValidReplyIdInParams,
  ensurePostedByUser,
  ensureRepliedByUser, 
  ensureValidUserIdInBody,
  ensureValidPostIdInBody,
};


