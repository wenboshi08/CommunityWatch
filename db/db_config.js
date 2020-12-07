const sqlite3 = require('sqlite3');

let sqlDb;

// name the columns of our tables for localization
const columnNames = {
  userId: "id",
  userName: "name",
  userPass: "password",
  neighborhoodTableId: "id",
  neighborhoodTableNeighborhood: "neighborhood",
  crimetypesTableId: "id",
  crimetypesTablecrime: "crimeType",
  crimeTableFileNumber: "fileNumber",
  crimeTableReportDate: "reportDate",
  crimeTableCrimeTypeId: "crimeTypeId",
  crimeTableNeighborhoodId: "neighborhoodId",
  crimeTableLocation: "location",
  crimeTableLatitude: "latitude",
  crimeTableLongitude: "longitude",
  feedTableUserId: "userId",
  feedTableNeighborhoodId: "neighborhoodId",
  postTablePostId: "id", 
  postTableUserId: "userId", 
  postTableNeighborhoodId: "neighborhoodId", 
  postTablePostContent: "content",
  replyTableReplyId: "id", 
  replyTableUserId: "userId", 
  replyTablePostId: "postId",
  replyTableReplyContent: "content",
  upvoteTableUserId: "userId",
  upvoteTablePostId: "postId",
  downvoteTableUserId: "userId",
  downvoteTablePostId: "postId",
  flagTableUserId: "userId",
  flagTablePostId: "postId",
};
Object.freeze(columnNames);

function createDb() {
  console.log("created our db!");
  sqlDb = new sqlite3.Database('crimedb.db', function() {
    createUserTable();
    createNeighborhoodTable();
    createCrimeTypesTable();
    createCrimeTable();
    createFeedTable();
    createPostTable();
    createReplyTable(); 
    createUpvoteTable();
    createDownvoteTable();
    createFlagTable();
  });
};

function createUserTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS users (
    ${columnNames.userId} INTEGER PRIMARY KEY AUTOINCREMENT,
    ${columnNames.userName} TEXT NOT NULL UNIQUE,
    ${columnNames.userPass} TEXT NOT NULL
  )`);
};

function createNeighborhoodTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS neighborhoods (
    ${columnNames.neighborhoodTableId} INTEGER PRIMARY KEY,
    ${columnNames.neighborhoodTableNeighborhood} TEXT NOT NULL UNIQUE
  )`);
};

function createCrimeTypesTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS crimetypes (
    ${columnNames.crimetypesTableId} INTEGER PRIMARY KEY,
    ${columnNames.crimetypesTablecrime} TEXT NOT NULL UNIQUE
  )`);
};

function createCrimeTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS crimes (
    ${columnNames.crimeTableFileNumber} TEXT PRIMARY KEY,
    ${columnNames.crimeTableReportDate} TEXT NOT NULL,
    ${columnNames.crimeTableCrimeTypeId} INTEGER NOT NULL,
    ${columnNames.crimeTableNeighborhoodId} INTEGER NOT NULL,
    ${columnNames.crimeTableLocation} TEXT NOT NULL,
    ${columnNames.crimeTableLatitude} REAL NOT NULL,
    ${columnNames.crimeTableLongitude} REAL NOT NULL,
    FOREIGN KEY(${columnNames.crimeTableNeighborhoodId})
    REFERENCES neighborhoods(${columnNames.neighborhoodTableId}),
    FOREIGN KEY(${columnNames.crimeTableCrimeTypeId})
    REFERENCES crimetypes(${columnNames.crimetypesTableId})
  )`);
};

function createFeedTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS feeds (
    ${columnNames.feedTableUserId} INTEGER NOT NULL,
    ${columnNames.feedTableNeighborhoodId} INTEGER NOT NULL,
    FOREIGN KEY(${columnNames.feedTableUserId})
    REFERENCES users(${columnNames.userId}),
    FOREIGN KEY(${columnNames.feedTableNeighborhoodId})
    REFERENCES neighborhoods(${columnNames.neighborhoodTableId}),
    PRIMARY KEY (${columnNames.feedTableUserId}, ${columnNames.feedTableNeighborhoodId})
  )`);
};

function createPostTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS posts (
    ${columnNames.postTablePostId} INTEGER PRIMARY KEY AUTOINCREMENT,
    ${columnNames.postTableUserId} INTEGER NOT NULL, 
    ${columnNames.postTableNeighborhoodId} INTEGER NOT NULL, 
    ${columnNames.postTablePostContent} TEXT NOT NULL, 
    FOREIGN KEY(${columnNames.postTableUserId})
    REFERENCES users(${columnNames.userId}),
    FOREIGN KEY(${columnNames.postTableNeighborhoodId})
    REFERENCES neighborhoods(${columnNames.neighborhoodTableId})
  )`); 
};

function createReplyTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS replies (
    ${columnNames.replyTableReplyId} INTEGER PRIMARY KEY AUTOINCREMENT,
    ${columnNames.replyTableUserId} INTEGER NOT NULL, 
    ${columnNames.replyTablePostId} INTEGER NOT NULL, 
    ${columnNames.replyTableReplyContent} TEXT NOT NULL, 
    FOREIGN KEY(${columnNames.replyTableUserId})
    REFERENCES users(${columnNames.userId}),
    FOREIGN KEY(${columnNames.replyTablePostId})
    REFERENCES posts(${columnNames.postTablePostId})
  )`);
};

function createUpvoteTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS upvotes (
    ${columnNames.upvoteTableUserId} INTEGER NOT NULL,
    ${columnNames.upvoteTablePostId} INTEGER NOT NULL,
    FOREIGN KEY(${columnNames.upvoteTableUserId})
    REFERENCES users(${columnNames.userId}),
    FOREIGN KEY(${columnNames.upvoteTablePostId})
    REFERENCES posts(${columnNames.postTablePostId}),
    PRIMARY KEY (${columnNames.upvoteTableUserId}, ${columnNames.upvoteTablePostId})
  )`);
};

function createDownvoteTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS downvotes (
    ${columnNames.downvoteTableUserId} INTEGER NOT NULL,
    ${columnNames.downvoteTablePostId} INTEGER NOT NULL,
    FOREIGN KEY(${columnNames.downvoteTableUserId})
    REFERENCES users(${columnNames.userId}),
    FOREIGN KEY(${columnNames.downvoteTablePostId})
    REFERENCES posts(${columnNames.postTablePostId}),
    PRIMARY KEY (${columnNames.downvoteTableUserId}, ${columnNames.downvoteTablePostId})
  )`);
};

function createFlagTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS flags (
    ${columnNames.flagTableUserId} INTEGER NOT NULL,
    ${columnNames.flagTablePostId} INTEGER NOT NULL,
    FOREIGN KEY(${columnNames.flagTableUserId})
    REFERENCES users(${columnNames.userId}),
    FOREIGN KEY(${columnNames.flagTablePostId})
    REFERENCES posts(${columnNames.postTablePostId}),
    PRIMARY KEY (${columnNames.flagTableUserId}, ${columnNames.flagTablePostId})
  )`);
};



// Helper wrapper functions that return promises that resolve when sql queries are complete.

function run(sqlQuery) {
  return new Promise((resolve, reject) => {
    sqlDb.run(sqlQuery, (err) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve();
      }
    })
  });
};

function get(sqlQuery) {
  return new Promise((resolve, reject) => {
    sqlDb.get(sqlQuery, (err, row) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(row);
      }
    })
  });
};

function all(sqlQuery) {
  return new Promise((resolve, reject) => {
    sqlDb.all(sqlQuery, (err, rows) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  });
};

createDb();

module.exports = {
  columnNames,
  get,
  all,
  run,
};